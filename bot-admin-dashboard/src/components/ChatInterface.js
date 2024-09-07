// import React, { useState, useRef, useEffect } from "react";
// import "./ChatInterface.css";

// const ChatInterface = () => {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
//   const [userSubmitted, setUserSubmitted] = useState(false); // Track if user info is submitted
//   const inputRef = useRef(null);
//   const spanRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (inputRef.current && spanRef.current) {
//       const spanWidth = spanRef.current.offsetWidth;
//       inputRef.current.style.width = `${spanWidth + 20}px`;
//     }
//   }, [input]);

//   const sendDataToBackend = async (message) => {
//     try {
//       const response = await fetch("http://localhost:3000/chatbot", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify([{ message }]),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const result = await response.json();
//       return result.result;
//     } catch (error) {
//       console.error("Error:", error);
//       return "Error: Could not get response";
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = { text: input, user: true };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput("");

//     const responseText = await sendDataToBackend(input);
//     const aiMessage = { text: responseText, user: false };
//     setMessages((prevMessages) => [...prevMessages, aiMessage]);
//   };

//   return (
//     <div>
//       <button
//         className="btn btn-primary float-right"
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           position: "fixed",
//           bottom: "20px",
//           right: "20px",
//           zIndex: 1000,
//         }}
//       >
//         <i className="bi bi-chat"></i>
//       </button>

//       {isOpen && (
//         <div className="chatbot-container">
//           <div className="chatbot-header">
//             <h5>
//               Interact with our Custom AI Chatbot
//               <i class="bi bi-robot"></i>
//             </h5>

//             <button
//               className="close-btn"
//               onClick={() => setIsOpen(false)}
//               aria-label="Close Chat"
//             >
//               &times;
//             </button>
//           </div>
//           <div className="chatbot-messages">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`message ${
//                   message.user ? "user-message" : "ai-message"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             ))}
//           </div>
//           <form className="chatbot-input-form" onSubmit={handleSubmit}>
//             <input
//               ref={inputRef}
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type your message..."
//               className="chat-input"
//             />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatInterface;

import React, { useState, useRef, useEffect } from "react";
import "./ChatInterface.css";

const ChatInterface = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const [userSubmitted, setUserSubmitted] = useState(false); // Track if user info is submitted
  const inputRef = useRef(null);
  const spanRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Dynamically adjust input width based on text
  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${Math.min(spanWidth + 20, 300)}px`;
    }
  }, [input]);

  const sendDataToBackend = async (message) => {
    try {
      const response = await fetch("http://localhost:3000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ message, userInfo }]), // Send user info along with message
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.error("Error:", error);
      return "Error: Could not get response";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setLoading(true);
    const responseText = await sendDataToBackend(input);
    setLoading(false);

    const aiMessage = { text: responseText, user: false };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  };

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (userInfo.name.trim() && userInfo.phone.trim()) {
      setUserSubmitted(true); // Move to chat
    } else {
      alert("Please provide valid name and phone number");
    }
  };

  return (
    <div>
      <button
        id="chatbot-btn"
        className="btn btn-primary float-right"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <i className="bi bi-chat"></i>
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h5>
              Interact with our Custom AI Chatbot{" "}
              <i className="bi bi-robot"></i>
            </h5>

            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              &times;
            </button>
          </div>

          {!userSubmitted ? (
            <form className="user-info-form" onSubmit={handleUserInfoSubmit}>
              <h6>Please provide your details to continue:</h6>
              <div className="input-group">
                <i className="bi bi-info-square"></i>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="input-group">
                <i className="bi bi-telephone-plus"></i>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <button type="submit">Submit</button>
            </form>
          ) : (
            <>
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.user ? "user-message" : "ai-message"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="chatbot-input-form" onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="chat-input"
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
