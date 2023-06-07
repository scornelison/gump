import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClients";
import { Configuration, OpenAIApi } from "openai";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [formError, setFormError] = useState(null);

  //Pirate Talk -

  const translateToPirate = async () => {
    //set "method" (text of the note) to our new pirate text
    let pirateText = "";
    // get the correct pirate text
    // make request to open ai for Pirate Text (use my note as input)
    const content = `for the following note please make it sound like a pirate wrote it:
      
${method}`;
    console.log("bla bla", content);

    // get if already set
    let apiKey = localStorage.getItem("apikey") || "";

    // ask for apiKey
    apiKey = prompt("what is your open ai key?", apiKey);
    if (apiKey === null) {
      alert("pressed cancel");
      return false;
    }
    if (!apiKey) {
      alert("no api key provided");
      return false;
    }

    // store the apiKey in localStorage
    localStorage.setItem("apikey", apiKey);

    const configuration = new Configuration({
      apiKey,
    });
    delete configuration.baseOptions.headers["User-Agent"];
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content,
        },
      ],
      // maxTokens: 100,
      temperature: 0,
    });
    console.log({ response });
    // Get result of request set as Pirate Text
    pirateText = response.data.choices[0].message.content;
    setMethod(pirateText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitted");

    if (!title || !method) {
      setFormError("Please fill in the method field correctly.");
      console.log("Form submission error: Missing title or method.");
      return;
    }

    const { data, error } = await supabase
      .from("notes")
      .update({ title, method })
      .eq("id", id);
    console.log({ data, error });

    if (error) {
      setFormError("Please fill in the method field correctly.");
      console.log("Form submission error: Missing title or method.");
      return;
    }

    console.log(data);
    setFormError(null);
    navigate("/");
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/", { replace: true });
      }
      if (data) {
        setTitle(data.title);
        setMethod(data.method);
        console.log(data);
      }
    };
    fetchNotes();
  }, [id, navigate]);
  return (
    <div className="page update">
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
        <button type="submit">Update Note</button>
        &nbsp;
        <button type="button" onClick={translateToPirate}>
          Translate to Pirate
        </button>
        {formError ? (
          <>
            <p className="error">{formError}</p>
          </>
        ) : null}
      </form>
    </div>
  );
};

export default Update;
