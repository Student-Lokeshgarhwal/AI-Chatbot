import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("") // use for input fill 
    const [recentPrompt, setRecentPrompt] = useState("") // use for show user text in block 
    const [prevPrompt, setPrevPrompt] = useState([]) // use for show resent prompts
    const [showResult, setShowResult] = useState(false) // use for blank the block 
    const [loading, setLoading] = useState(false) // use for show the loader while fatching data
    const [resultData, setResultData] = useState("") // use for show the ai result in block

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(input)
        let response;
        if (prompt !== undefined) {
            const nameexist = prevPrompt.filter((eachprompt)=>(eachprompt === prompt))
               if(nameexist.length == 0){
                setPrevPrompt((prev) => [...prev, prompt])
                    setRecentPrompt(prompt)
                    response = await run(prompt)
               }else{
            console.log("available")
            setRecentPrompt(prompt)
            response = await run(prompt)
        }
        }
        else {
            setPrevPrompt((prev) => [...prev, input])
            response = await run(input)
        }
        const responseArray = response.split("**");
        let newResponse = "";
        //   console.log(responseArray.length)

        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i]
            }
            else {
                newResponse += "<b>" + responseArray[i] + "</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        //   console.log(response)
        setResultData(newResponse2)
        setLoading(false)
        setInput("")
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
       await onSent(prompt);
    }

    const contextValue = {

        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        loadPrompt
    }

    return (

        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider;