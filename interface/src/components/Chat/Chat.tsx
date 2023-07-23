import React, { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Editor } from "primereact/editor";

interface ChatProps {
  newsLetter: any;
  messageHistory: any;
  conversation: any;
  subscriptors: any;
}

export default function Chat({
  messageHistory,
  conversation,
  newsLetter,
  subscriptors,
}: ChatProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [eoa, setEoa] = useState<string>("");

  const handleSend = async () => {
    if (inputValue) {
      await onSendMessage(inputValue);

      await axios.post("http://localhost:3001/api/v1/newsletter/push", {
        addresses: subscriptors,
        owner: newsLetter.newsletterOwner,
        newsletterTitle: newsLetter.title,
        newsletterText: inputValue.substring(0, 130).concat("..."),
      });

      setInputValue("");
    }
  };

  function addHeaderClasses(inputStrings: any) {
    const h1Regex = /<h1\b[^>]*>(.*?)<\/h1>/g;
    const h2Regex = /<h2\b[^>]*>(.*?)<\/h2>/g;

    inputStrings = inputStrings.replace(
      h1Regex,
      '<h1 style="font-size: xxx-large">$1</h1>'
    );

    inputStrings = inputStrings.replace(
      h2Regex,
      '<h2 style="font-size: xx-large">$1</h2>'
    );

    return inputStrings;
  }

  const MessageList = (messages: any) => {
    messages = messages.messages.filter(
      (v: { id: any }, i: any, a: any[]) =>
        a.findIndex((t: { id: any }) => t.id === v.id) === i
    );

    return (
      <ul>
        {messages.map((message: any) => (
          <li
            key={message.id}
            className="messageItem"
            title="Click to log this message to the console"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: addHeaderClasses(message.content),
              }}
            />
          </li>
        ))}
      </ul>
    );
  };

  const onSendMessage = async (value: any) => {
    return conversation.send(value);
  };

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, []);

  useEffect(() => {
    setEoa(localStorage.getItem("eoa") as string);
  }, [eoa]);

  return (
    <div>
      <div>
        <MessageList messages={messageHistory} />
      </div>
      {newsLetter.newsletterOwner.id === eoa?.toLowerCase() && (
        <>
          <div className="w-full flex mt-8">
            <Editor
              value={inputValue}
              onTextChange={(e) => setInputValue(e.htmlValue as string)}
              style={{ height: "320px", width: "1130px" }}
            />{" "}
          </div>
          <div className="mx-auto mt-10">
            <button
              onClick={handleSend}
              className=" bg-main rounded-lg my-auto h-fit py-2 px-4 flex flex-row mx-auto"
            >
              <span>Send Newsletter</span>
              <ArrowUpRightIcon
                className="h-6 w-6 text-darkText ml-4"
                aria-hidden="true"
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
