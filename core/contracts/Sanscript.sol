// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

contract Sanscript is Ownable {

    struct Newsletter {
        string image;
        string title;
        string description;
        uint256 pricePerMonth;
    }

    struct AttestationData {
        address newsletterOwner;
        uint8 newsletterNonce;
    }

    event AddedNewsletter(address newsletterOwner, uint8 newsletterNonce, string image, string title, string description, uint256 pricePerMonth);
    event ChangedNewsletterPrice(address newsletterOwner, uint8 newsletterNonce, uint256 newPrice);

    mapping(address => uint8) private nonces;
    mapping(address => mapping( uint => Newsletter)) public newsletter;
    uint256 public price;
    
    IERC20 immutable USDC;
    IEAS immutable EAS;
    bytes32 immutable EAS_SCHEMA;

    constructor(IERC20 _usdc, uint256 _price, IEAS _eas, bytes32 _easSchema){
        USDC = _usdc;
        EAS = _eas;
        EAS_SCHEMA = _easSchema;
        price = _price;
    }

    function addNewsletter(string memory image, string memory title, string memory description, uint256 pricePerMonth) external {
        require(USDC.allowance(_msgSender(),address(this))>=price, "Insufficient allowance");

        bool success = USDC.transferFrom(_msgSender(), owner(), price);
        require(success, "Transfer failed");

        uint8 nonce = nonces[_msgSender()];
        newsletter[_msgSender()][nonce] = Newsletter(image, title, description, pricePerMonth);
        nonces[_msgSender()] = nonce + 1;

        emit AddedNewsletter(_msgSender(), nonce, image, title, description, pricePerMonth);

    }

    function changePriceProvider(uint256 newPrice) external onlyOwner {
        price = newPrice;
    }

    function changeNewsletterPrice(uint8 newsletterNonce, uint256 newPrice) external {
        address newsletterOwner = _msgSender();
        require(newsletter[newsletterOwner][newsletterNonce].pricePerMonth != 0, "Invalid newsletter nonce");

        newsletter[newsletterOwner][newsletterNonce].pricePerMonth = newPrice;

        emit ChangedNewsletterPrice(newsletterOwner, newsletterNonce, newPrice);
    }

    function subscribeNewsletter(address newsletterOwner, uint8 newsletterNonce) external {

        Newsletter memory nwLetter = newsletter[newsletterOwner][newsletterNonce];
        require(bytes(nwLetter.title).length > 0, "This newsletter does not exist");

        uint256 allowance = USDC.allowance(_msgSender(),address(this));
        require(allowance >= nwLetter.pricePerMonth, "Insufficient allowance");
        
        (,uint256 monthsPay) = SafeMath.tryDiv(allowance,nwLetter.pricePerMonth);
        (,uint256 amountPay) = SafeMath.tryMul(monthsPay,nwLetter.pricePerMonth);
        bool success = USDC.transferFrom(_msgSender(), newsletterOwner, amountPay);
        require(success, "Transfer failed");

        generateSubscriptionAttestation(monthsPay, newsletterOwner, newsletterNonce);

    }

    function generateSubscriptionAttestation(uint256 months, address newsletterOwner, uint8 newsletterNonce) internal {

        AttestationData memory attestationData = AttestationData(newsletterOwner,newsletterNonce);

        uint256 expirationTime = block.timestamp + SafeMath.mul((30 days), months);

        AttestationRequestData memory data;
        data.recipient = _msgSender(); 
        data.expirationTime = SafeCast.toUint64(expirationTime);
        data.revocable = false; 
        data.data = abi.encode(attestationData);
        data.value = 0;
        
        AttestationRequest memory request = AttestationRequest(EAS_SCHEMA,data);

        bytes32 attestUid = EAS.attest(request);

        require(attestUid != bytes32(0), "Failed to create attestUid");

    }

}
