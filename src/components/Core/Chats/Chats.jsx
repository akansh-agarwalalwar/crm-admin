import React, { useState, useEffect } from "react";
import axios from "axios";

function Chats() {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch phone numbers from the API
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/whatsapp/getChats")
      .then((response) => {
        setPhoneNumbers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching phone numbers:", error);
      });
  }, []);

  // Fetch chat history for the selected phone number
  useEffect(() => {
    if (selectedPhoneNumber) {
      axios
        .get(
          `http://localhost:4000/api/whatsapp/history/${selectedPhoneNumber}`
        )
        .then((response) => {
          console.log("API Response:", response.data); // Debugging
          setChats(response.data.chats || []); // Ensure chats is always an array
          setSelectedChat({
            name: selectedPhoneNumber,
            messages: response.data.chats || [],
          });
        })
        .catch((error) => {
          console.error("Error fetching WhatsApp chat history:", error);
        });
    }
  }, [selectedPhoneNumber]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && selectedPhoneNumber) {
      axios
        .post("http://localhost:4000/api/whatsapp/send", {
          to: selectedPhoneNumber,
          message: newMessage,
          phoneNumberId: selectedPhoneNumberId,
        })
        .then((response) => {
          setChats((prevChats) => [
            ...prevChats,
            { id: Date.now(), from: "me", text: newMessage },
          ]);
          setNewMessage("");
        })
        .catch((error) => {
          console.error("Error sending WhatsApp message:", error);
        });
    }
  };

  return (
    <div className="flex h-[90vh] w-full">
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        <h2 className="p-4 font-bold border-b">Phone Numbers</h2>
        {phoneNumbers.map((item, index) => (
          <div
            key={index}
            className={`p-4 cursor-pointer border-b hover:bg-gray-200 ${
              selectedPhoneNumber === item.phoneNumber ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              setSelectedPhoneNumber(item.phoneNumber);
              setSelectedPhoneNumberId(item.id);
              setSelectedChat(null);
            }}
          >
            {item.phoneNumber}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedPhoneNumber && (
          <>
            <div className="p-4 bg-gray-200 font-bold">
              {selectedPhoneNumber}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 w-full">
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg w-full ${
                    chat.from === "me"
                      ? "bg-green-500 self-end "
                      : "bg-blue-500 self-start"
                  }`}
                >
                  {chat.text}
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t flex items-center">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg mr-2"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="bg-blue-500 text-black px-4 py-2 rounded-lg"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        )}
        {!selectedPhoneNumber && (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a phone number to view chats
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;