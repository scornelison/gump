import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClients";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

//Notes
const Create = (props) => {
  const navigate = useNavigate();
  const session = props.session;

  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [formError, setFormError] = useState(null);

  //OpenAI

  const [openaiPrompt, setOpenaiPrompt] = useState("");
  const [openaiResponse, setOpenaiResponse] = useState("");

  //Notes
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !method) {
      setFormError("Please fill in the method field correctly.");
      console.log("Form submission error: Missing title or method.");
      return;
    }

    console.log(`Submitting form with title "${title}" and method "${method}"`);
    const newNote = { title, method, user_id: session.user.id };
    console.log({ newNote });
    const { data, error } = await supabase
      .from("notes")
      .insert([newNote])
      .select();

    if (error) {
      console.log({ error: error });
      setFormError("Please fill in all the fields correctly.");
    } else {
      console.log({ data });
      setFormError(null);
      navigate("/");
    }
  };

  //OpenAI
  const handleOpenaiSubmit = async () => {
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `please anwser the following prompt:
            ${openaiPrompt}`,
          },
        ],
        // maxTokens: 100,
        temperature: 0,
      });
      console.log({ response });
      //Content is going to have to be adjusted

      // {
      //   "id": "chatcmpl-7EUk6dQtB26Lszwoau4Bgy2fJikSh",
      //   "object": "chat.completion",
      //   "created": 1683689122,
      //   "model": "gpt-3.5-turbo-0301",
      //   "usage": {
      //     "prompt_tokens": 12,
      //     "completion_tokens": 9,
      //     "total_tokens": 21
      //   },
      //   "choices": [
      //     {
      //       "message": {
      //         "role": "assistant",
      //         "content": "Hello! How can I assist you today?"
      //       },
      //       "finish_reason": "stop",
      //       "index": 0
      //     }
      //   ]
      // }
      // response.data.choices[]
      const data = response.data;
      console.log([
        data,
        data.choices,
        data.choices[0],
        // data.choices[0].message,
        // data.choices[0].message.content,
      ]);
      if (
        data &&
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content
      ) {
        setOpenaiResponse(data.choices[0].message.content);
      } else {
        setOpenaiResponse("Error: Invalid response from OpenAI API");
      }
    } catch (error) {
      console.error(error);
      setOpenaiResponse("Error: " + error.message);
    }
  };

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <label htmlFor="method">Note:</label>
        <textarea
          id="method"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value);
          }}
        />
        <button type="submit">Create New Note</button>
        <p></p>

        <label htmlFor="question">Question for AI:</label>
        <textarea
          id="question"
          value={openaiPrompt}
          onChange={(e) => {
            setOpenaiPrompt(e.target.value);
          }}
        />

        <p>
          <button type="button" onClick={handleOpenaiSubmit}>
            Send
          </button>
        </p>

        {/* {openaiResponse && (
          <div>
            <h3>OpenAI response:</h3>
            <p>{openaiResponse}</p>
          </div>
        )} */}

        {formError && (
          <>
            <p className="error">{formError}</p>
            {console.log("Form error:", formError)}
          </>
        )}
        {openaiResponse}
      </form>
    </div>
  );
};

export default Create;
