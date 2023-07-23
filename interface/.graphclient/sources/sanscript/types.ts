// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace SanscriptTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Newsletter = {
  id: Scalars['ID'];
  newsletterOwner: Owner;
  newsletterNonce: Scalars['Int'];
  image: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  token: Scalars['String'];
  pricePerMonth: Scalars['BigInt'];
  blockNumber: Scalars['BigInt'];
  blockTimestamp: Scalars['BigInt'];
  transactionHash: Scalars['Bytes'];
};

export type Newsletter_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  newsletterOwner?: InputMaybe<Scalars['String']>;
  newsletterOwner_not?: InputMaybe<Scalars['String']>;
  newsletterOwner_gt?: InputMaybe<Scalars['String']>;
  newsletterOwner_lt?: InputMaybe<Scalars['String']>;
  newsletterOwner_gte?: InputMaybe<Scalars['String']>;
  newsletterOwner_lte?: InputMaybe<Scalars['String']>;
  newsletterOwner_in?: InputMaybe<Array<Scalars['String']>>;
  newsletterOwner_not_in?: InputMaybe<Array<Scalars['String']>>;
  newsletterOwner_contains?: InputMaybe<Scalars['String']>;
  newsletterOwner_contains_nocase?: InputMaybe<Scalars['String']>;
  newsletterOwner_not_contains?: InputMaybe<Scalars['String']>;
  newsletterOwner_not_contains_nocase?: InputMaybe<Scalars['String']>;
  newsletterOwner_starts_with?: InputMaybe<Scalars['String']>;
  newsletterOwner_starts_with_nocase?: InputMaybe<Scalars['String']>;
  newsletterOwner_not_starts_with?: InputMaybe<Scalars['String']>;
  newsletterOwner_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  newsletterOwner_ends_with?: InputMaybe<Scalars['String']>;
  newsletterOwner_ends_with_nocase?: InputMaybe<Scalars['String']>;
  newsletterOwner_not_ends_with?: InputMaybe<Scalars['String']>;
  newsletterOwner_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  newsletterOwner_?: InputMaybe<Owner_filter>;
  newsletterNonce?: InputMaybe<Scalars['Int']>;
  newsletterNonce_not?: InputMaybe<Scalars['Int']>;
  newsletterNonce_gt?: InputMaybe<Scalars['Int']>;
  newsletterNonce_lt?: InputMaybe<Scalars['Int']>;
  newsletterNonce_gte?: InputMaybe<Scalars['Int']>;
  newsletterNonce_lte?: InputMaybe<Scalars['Int']>;
  newsletterNonce_in?: InputMaybe<Array<Scalars['Int']>>;
  newsletterNonce_not_in?: InputMaybe<Array<Scalars['Int']>>;
  image?: InputMaybe<Scalars['String']>;
  image_not?: InputMaybe<Scalars['String']>;
  image_gt?: InputMaybe<Scalars['String']>;
  image_lt?: InputMaybe<Scalars['String']>;
  image_gte?: InputMaybe<Scalars['String']>;
  image_lte?: InputMaybe<Scalars['String']>;
  image_in?: InputMaybe<Array<Scalars['String']>>;
  image_not_in?: InputMaybe<Array<Scalars['String']>>;
  image_contains?: InputMaybe<Scalars['String']>;
  image_contains_nocase?: InputMaybe<Scalars['String']>;
  image_not_contains?: InputMaybe<Scalars['String']>;
  image_not_contains_nocase?: InputMaybe<Scalars['String']>;
  image_starts_with?: InputMaybe<Scalars['String']>;
  image_starts_with_nocase?: InputMaybe<Scalars['String']>;
  image_not_starts_with?: InputMaybe<Scalars['String']>;
  image_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  image_ends_with?: InputMaybe<Scalars['String']>;
  image_ends_with_nocase?: InputMaybe<Scalars['String']>;
  image_not_ends_with?: InputMaybe<Scalars['String']>;
  image_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  title_not?: InputMaybe<Scalars['String']>;
  title_gt?: InputMaybe<Scalars['String']>;
  title_lt?: InputMaybe<Scalars['String']>;
  title_gte?: InputMaybe<Scalars['String']>;
  title_lte?: InputMaybe<Scalars['String']>;
  title_in?: InputMaybe<Array<Scalars['String']>>;
  title_not_in?: InputMaybe<Array<Scalars['String']>>;
  title_contains?: InputMaybe<Scalars['String']>;
  title_contains_nocase?: InputMaybe<Scalars['String']>;
  title_not_contains?: InputMaybe<Scalars['String']>;
  title_not_contains_nocase?: InputMaybe<Scalars['String']>;
  title_starts_with?: InputMaybe<Scalars['String']>;
  title_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_starts_with?: InputMaybe<Scalars['String']>;
  title_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  title_ends_with?: InputMaybe<Scalars['String']>;
  title_ends_with_nocase?: InputMaybe<Scalars['String']>;
  title_not_ends_with?: InputMaybe<Scalars['String']>;
  title_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_contains_nocase?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_contains_nocase?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_ends_with_nocase?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pricePerMonth?: InputMaybe<Scalars['BigInt']>;
  pricePerMonth_not?: InputMaybe<Scalars['BigInt']>;
  pricePerMonth_gt?: InputMaybe<Scalars['BigInt']>;
  pricePerMonth_lt?: InputMaybe<Scalars['BigInt']>;
  pricePerMonth_gte?: InputMaybe<Scalars['BigInt']>;
  pricePerMonth_lte?: InputMaybe<Scalars['BigInt']>;
  pricePerMonth_in?: InputMaybe<Array<Scalars['BigInt']>>;
  pricePerMonth_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Newsletter_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Newsletter_filter>>>;
};

export type Newsletter_orderBy =
  | 'id'
  | 'newsletterOwner'
  | 'newsletterOwner__id'
  | 'newsletterOwner__newslettersAmount'
  | 'newsletterOwner__isVerifiedHuman'
  | 'newsletterNonce'
  | 'image'
  | 'title'
  | 'description'
  | 'token'
  | 'pricePerMonth'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Owner = {
  id: Scalars['ID'];
  newsletters?: Maybe<Array<Newsletter>>;
  newslettersAmount: Scalars['BigInt'];
  isVerifiedHuman: Scalars['Boolean'];
};


export type OwnernewslettersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Newsletter_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Newsletter_filter>;
};

export type Owner_filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  newsletters_?: InputMaybe<Newsletter_filter>;
  newslettersAmount?: InputMaybe<Scalars['BigInt']>;
  newslettersAmount_not?: InputMaybe<Scalars['BigInt']>;
  newslettersAmount_gt?: InputMaybe<Scalars['BigInt']>;
  newslettersAmount_lt?: InputMaybe<Scalars['BigInt']>;
  newslettersAmount_gte?: InputMaybe<Scalars['BigInt']>;
  newslettersAmount_lte?: InputMaybe<Scalars['BigInt']>;
  newslettersAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newslettersAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  isVerifiedHuman?: InputMaybe<Scalars['Boolean']>;
  isVerifiedHuman_not?: InputMaybe<Scalars['Boolean']>;
  isVerifiedHuman_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isVerifiedHuman_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Owner_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Owner_filter>>>;
};

export type Owner_orderBy =
  | 'id'
  | 'newsletters'
  | 'newslettersAmount'
  | 'isVerifiedHuman';

export type Query = {
  owner?: Maybe<Owner>;
  owners: Array<Owner>;
  newsletter?: Maybe<Newsletter>;
  newsletters: Array<Newsletter>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryownerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Owner_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Owner_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynewsletterArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerynewslettersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Newsletter_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Newsletter_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  owner?: Maybe<Owner>;
  owners: Array<Owner>;
  newsletter?: Maybe<Newsletter>;
  newsletters: Array<Newsletter>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionownerArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Owner_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Owner_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnewsletterArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionnewslettersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Newsletter_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Newsletter_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  owner: InContextSdkMethod<Query['owner'], QueryownerArgs, MeshContext>,
  /** null **/
  owners: InContextSdkMethod<Query['owners'], QueryownersArgs, MeshContext>,
  /** null **/
  newsletter: InContextSdkMethod<Query['newsletter'], QuerynewsletterArgs, MeshContext>,
  /** null **/
  newsletters: InContextSdkMethod<Query['newsletters'], QuerynewslettersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  owner: InContextSdkMethod<Subscription['owner'], SubscriptionownerArgs, MeshContext>,
  /** null **/
  owners: InContextSdkMethod<Subscription['owners'], SubscriptionownersArgs, MeshContext>,
  /** null **/
  newsletter: InContextSdkMethod<Subscription['newsletter'], SubscriptionnewsletterArgs, MeshContext>,
  /** null **/
  newsletters: InContextSdkMethod<Subscription['newsletters'], SubscriptionnewslettersArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["sanscript"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
