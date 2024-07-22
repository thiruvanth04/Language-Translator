import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Select, MenuItem, Typography, Snackbar } from '@mui/material';
import axios from 'axios';

function Trail() {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setText(transcript);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const handleTranslate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/translate', {
        text,
        targetLanguage,
      });
      setTranslatedText(response.data.translation);
      setSuccessMessage('Translation successful!');
      setError('');
    } catch (error) {
      console.error('Error translating text:', error);
      setError('Failed to translate text. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Language Translation App
      </Typography>
      <TextField
        label="Text to Translate"
        multiline
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
      />
      <Select
        value={targetLanguage}
        onChange={(e) => setTargetLanguage(e.target.value)}
        displayEmpty
        fullWidth
      >
        <MenuItem value="">Select Target Language</MenuItem>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Spanish</MenuItem>
        <MenuItem value="fr">French</MenuItem>
        {/* Add more languages as needed */}
      </Select>
      <Button variant="contained" color="primary" onClick={handleTranslate} fullWidth>
        Translate
      </Button>
      <Button variant="contained" color="secondary" onClick={() => setIsListening(!isListening)} fullWidth>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </Button>
      <Typography variant="h6" gutterBottom>
        Translated Text
      </Typography>
      <Typography>{translatedText}</Typography>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        message={error}
      />
    </Container>
  );
}

export default Trail;