/*
import React, { useEffect } from "react";
import countries from "./data.js";
import { FaVolumeUp, FaCopy, FaExchangeAlt } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

const Translate = () => {
    useEffect(() => {
        const fromText = document.querySelector(".from-text");
        const toText = document.querySelector(".to-text");
        const exchangeIcon = document.querySelector(".exchange");
        const selectTag = document.querySelectorAll("select");
        const icons = document.querySelectorAll(".row i");
        const translateBtn = document.querySelector("button");
        
        selectTag.forEach((tag, id) => {
            for (let country_code in countries) {
                let selected =
                    id === 0
                        ? country_code === "en-GB"
                            ? "selected"
                            : ""
                        : country_code === "hi-IN"
                            ? "selected"
                            : "";
                let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
                tag.insertAdjacentHTML("beforeend", option);
            }
        });

        exchangeIcon.addEventListener("click", () => {
            let tempText = fromText.value;
            let tempLang = selectTag[0].value;
            fromText.value = toText.value;
            toText.value = tempText;
            selectTag[0].value = selectTag[1].value;
            selectTag[1].value = tempLang;
        });

        fromText.addEventListener("keyup", () => {
            if (!fromText.value) {
                toText.value = "";
            }
        });

        translateBtn.addEventListener("click", async () => {
            let text = fromText.value.trim();
            let translateFrom = selectTag[0].value;
            let translateTo = selectTag[1].value;
            if (!text) return;
            toText.setAttribute("placeholder", "Translating...");
            try {
                const response = await
                    fetch(`http://localhost:5000/?text=${text}&source=${translateFrom}&target=${translateTo}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const translatedText = await response.text();
                toText.value = translatedText;
                toText.setAttribute("placeholder", "Translation");
            } catch (error) {
                console.error("Fetch error:", error);
                toText.setAttribute("placeholder", "Error in translation");
            }
        });

        icons.forEach((icon) => {
            icon.addEventListener("click", ({ target }) => {
                if (!fromText.value || !toText.value) return;
                if (target.classList.contains("fa-copy")) {
                    if (target.id === "from") {
                        navigator.clipboard.writeText(fromText.value);
                    } else {
                        navigator.clipboard.writeText(toText.value);
                    }
                } else {
                    let utterance;
                    if (target.id === "from") {
                        utterance = new SpeechSynthesisUtterance(fromText.value);
                        utterance.lang = selectTag[0].value;
                    } else {
                        utterance = new SpeechSynthesisUtterance(toText.value);
                        utterance.lang = selectTag[1].value;
                    }
                    speechSynthesis.speak(utterance);
                }
            });
        });
    }, []);
    return (
        <>
            <div className="flex flex-col items-center py-10 bg-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">TRANSLATOR</h1>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <textarea
                            spellCheck="false"
                            className="from-text border border-gray-300 p-4 w-full h-32 text-sm resize-none placeholder-gray-400"
                            placeholder="Enter text"
                        ></textarea>
                        <textarea
                            spellCheck="false"
                            readOnly
                            disabled
                            className="to-text border border-gray-300 p-4 w-full h-32 text-sm resize-none placeholder-gray-400"
                            placeholder="Translation"
                        ></textarea>
                    </div>
                    <ul className="flex justify-between items-center mb-6">
                        <li className="flex items-center space-x-2">
                            <div className="icons flex space-x-2">
                                <FaVolumeUp id="from" className="text-2xl cursor-pointer" />
                                <FaCopy id="from" className="text-2xl cursor-pointer" />
                            </div>
                            <select className="border border-gray-300 p-2 text-lg"></select>
                        </li>
                        <li className="exchange cursor-pointer text-3xl">
                            <FaExchangeAlt />
                        </li>
                        <li className="flex items-center space-x-2">
                            <select className="border border-gray-300 p-2 text-lg"></select>
                            <div className="icons flex space-x-2">
                                <FaVolumeUp id="to" className="text-2xl cursor-pointer" />
                                <FaCopy id="to" className="text-2xl cursor-pointer" />
                            </div>
                        </li>
                    </ul>
                    <button className="bg-green-700 text-white py-2 px-4 rounded">Translate!</button>
                </div>
            </div>
        </>
    );
};

export default Translate;
*/



import React, { useEffect, useState } from "react";
import countries from "./data.js";
import { FaVolumeUp, FaCopy, FaExchangeAlt, FaMicrophone, FaStop } from 'react-icons/fa';
import 'tailwindcss/tailwind.css';

const Translate = () => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        // Initialize SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("SpeechRecognition API not supported.");
            return;
        }

        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = "en-GB"; // Default language, adjust as needed
        recognitionInstance.interimResults = false;

        recognitionInstance.onresult = (event) => {
            const fromText = document.querySelector(".from-text");
            fromText.value = event.results[0][0].transcript;
        };
        recognitionInstance.onend = () => {
            setIsListening(false);
        };
        recognitionInstance.onerror = (error) => {
            console.error("Speech Recognition Error:", error);
            setIsListening(false);
        };

        setRecognition(recognitionInstance);

        return () => {
            if (recognitionInstance) {
                recognitionInstance.stop();
            }
        };
    }, []);

    const handleStartListening = () => {
        if (recognition && !isListening) {
            recognition.start();
            setIsListening(true);
        }
    };

    const handleStopListening = () => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    };

    useEffect(() => {
        const fromText = document.querySelector(".from-text");
        const toText = document.querySelector(".to-text");
        const exchangeIcon = document.querySelector(".exchange");
        const selectTag = document.querySelectorAll("select");
        const icons = document.querySelectorAll(".row i");
        const translateBtn = document.querySelector("#translate-btn");

        selectTag.forEach((tag, id) => {
            for (let country_code in countries) {
                let selected =
                    id === 0
                        ? country_code === "en-GB"
                            ? "selected"
                            : ""
                        : country_code === "hi-IN"
                            ? "selected"
                            : "";
                let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
                tag.insertAdjacentHTML("beforeend", option);
            }
        });

        exchangeIcon.addEventListener("click", () => {
            let tempText = fromText.value;
            let tempLang = selectTag[0].value;
            fromText.value = toText.value;
            toText.value = tempText;
            selectTag[0].value = selectTag[1].value;
            selectTag[1].value = tempLang;
        });

        fromText.addEventListener("keyup", () => {
            if (!fromText.value) {
                toText.value = "";
            }
        });

        translateBtn.addEventListener("click", async () => {
            let text = fromText.value.trim();
            let translateFrom = selectTag[0].value;
            let translateTo = selectTag[1].value;
            if (!text) return;
            toText.setAttribute("placeholder", "Translating...");
            try {
                const response = await fetch(`http://localhost:5000/?text=${text}&source=${translateFrom}&target=${translateTo}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const translatedText = await response.text();
                toText.value = translatedText;
                toText.setAttribute("placeholder", "Translation");
            } catch (error) {
                console.error("Fetch error:", error);
                toText.setAttribute("placeholder", "Error in translation");
            }
        });

        icons.forEach((icon) => {
            icon.addEventListener("click", ({ target }) => {
                if (!fromText.value || !toText.value) return;
                if (target.classList.contains("fa-copy")) {
                    if (target.id === "from") {
                        navigator.clipboard.writeText(fromText.value);
                    } else {
                        navigator.clipboard.writeText(toText.value);
                    }
                } else {
                    let utterance;
                    if (target.id === "from") {
                        utterance = new SpeechSynthesisUtterance(fromText.value);
                        utterance.lang = selectTag[0].value;
                    } else {
                        utterance = new SpeechSynthesisUtterance(toText.value);
                        utterance.lang = selectTag[1].value;
                    }
                    speechSynthesis.speak(utterance);
                }
            });
        });

    }, []);

    return (
        <>
            <div className="flex flex-col items-center py-10 bg-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">TRANSLATOR</h1>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <textarea
                            spellCheck="false"
                            className="from-text border border-gray-300 p-4 w-full h-32 text-sm resize-none placeholder-gray-400"
                            placeholder="Enter text"
                        ></textarea>
                        <textarea
                            spellCheck="false"
                            readOnly
                            disabled
                            className="to-text border border-gray-300 p-4 w-full h-32 text-sm resize-none placeholder-gray-400"
                            placeholder="Translation"
                        ></textarea>
                    </div>
                    <ul className="flex justify-between items-center mb-6">
                        <li className="flex items-center space-x-2">
                            <div className="icons flex space-x-2">
                                <FaVolumeUp id="from" className="text-2xl cursor-pointer" />
                                <FaCopy id="from" className="text-2xl cursor-pointer" />
                            </div>
                            <select className="border border-gray-300 p-2 text-lg"></select>
                        </li>
                        <li className="exchange cursor-pointer text-3xl">
                            <FaExchangeAlt />
                        </li>
                        <li className="flex items-center space-x-2">
                            <select className="border border-gray-300 p-2 text-lg"></select>
                            <div className="icons flex space-x-2">
                                <FaVolumeUp id="to" className="text-2xl cursor-pointer" />
                                <FaCopy id="to" className="text-2xl cursor-pointer" />
                            </div>
                        </li>
                    </ul>
                    <button id="translate-btn" className="bg-green-700 text-white py-2 px-4 rounded">Translate!</button>
                    <button
                        id="mic-start-btn"
                        className={`bg-gray-300 text-white py-2 px-4 rounded mt-4 flex items-center space-x-2 ${isListening ? 'bg-red-500' : ''}`}
                        onClick={handleStartListening}
                    >
                        <FaMicrophone className="text-xl" />
                        <span>Start Talking</span>
                    </button>
                    <button
                        id="mic-stop-btn"
                        className={`bg-gray-300 text-white py-2 px-4 rounded mt-4 flex items-center space-x-2 ${isListening ? '' : 'hidden'}`}
                        onClick={handleStopListening}
                    >
                        <FaStop className="text-xl" />
                        <span>Stop Talking</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Translate;