import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const MusicPlayer = ({ isPlaying, isWinning }) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const winSoundRef = useRef(null);
  const loseSoundRef = useRef(null);

  // Create audio context for web audio API (for programmatic sounds)
  useEffect(() => {
    // Since we don't have actual audio files, we'll create simple beep sounds
    // In a real implementation, you'd load actual audio files here
    
    if (isPlaying && isWinning && !isMuted) {
      playWinSound();
    }
  }, [isPlaying, isWinning, isMuted]);

  // Simple programmatic sound generation
  const playWinSound = () => {
    if (isMuted) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a much louder and more prominent victory fanfare
      const victorySequence = [
        { freq: 261.63, time: 0, duration: 0.3 },    // C
        { freq: 329.63, time: 0.1, duration: 0.3 },  // E
        { freq: 392.00, time: 0.2, duration: 0.3 },  // G
        { freq: 523.25, time: 0.3, duration: 0.5 },  // C (higher)
        { freq: 659.25, time: 0.5, duration: 0.5 },  // E (higher)
        { freq: 783.99, time: 0.7, duration: 0.8 },  // G (higher)
        { freq: 1046.50, time: 1.0, duration: 1.0 }, // C (highest)
      ];
      
      victorySequence.forEach(({ freq, time, duration }) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.type = 'triangle'; // Warmer sound
        
        // Much louder envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + time + 0.01); // Much louder
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + duration);
        
        oscillator.start(audioContext.currentTime + time);
        oscillator.stop(audioContext.currentTime + time + duration);
      });

      // Add celebratory bells
      setTimeout(() => {
        for (let i = 0; i < 8; i++) {
          const bellOsc = audioContext.createOscillator();
          const bellGain = audioContext.createGain();
          
          bellOsc.connect(bellGain);
          bellGain.connect(audioContext.destination);
          
          bellOsc.frequency.setValueAtTime(1000 + Math.random() * 500, audioContext.currentTime);
          bellOsc.type = 'sine';
          
          bellGain.gain.setValueAtTime(0, audioContext.currentTime);
          bellGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + i * 0.1 + 0.01);
          bellGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);
          
          bellOsc.start(audioContext.currentTime + i * 0.1);
          bellOsc.stop(audioContext.currentTime + i * 0.1 + 0.3);
        }
      }, 300);
      
    } catch (error) {
      console.log('Audio not supported or blocked');
    }
  };

  const playLoseSound = () => {
    if (isMuted) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a sad, descending sound
      const notes = [392.00, 349.23, 329.63, 261.63]; // G, F, E, C (descending)
      
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sawtooth'; // Different waveform for sadder sound
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + index * 0.15 + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + index * 0.15 + 0.3);
        
        oscillator.start(audioContext.currentTime + index * 0.15);
        oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3);
      });
    } catch (error) {
      console.log('Audio not supported or blocked');
    }
  };

  const playCollectionSound = () => {
    if (isMuted) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a sparkly collection sound
      for (let i = 0; i < 5; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Random frequency for sparkly effect
        const frequency = 800 + Math.random() * 800;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + i * 0.05 + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + i * 0.05 + 0.1);
        
        oscillator.start(audioContext.currentTime + i * 0.05);
        oscillator.stop(audioContext.currentTime + i * 0.05 + 0.1);
      }
    } catch (error) {
      console.log('Audio not supported or blocked');
    }
  };

  // Background ambient music simulation
  const playBackgroundMusic = () => {
    if (isMuted) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a simple ambient drone
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator1.frequency.setValueAtTime(220, audioContext.currentTime); // A3
      oscillator2.frequency.setValueAtTime(330, audioContext.currentTime); // E4
      
      oscillator1.type = 'sine';
      oscillator2.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Very quiet background
      
      oscillator1.start(audioContext.currentTime);
      oscillator2.start(audioContext.currentTime);
      
      // Stop after 10 seconds
      setTimeout(() => {
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        oscillator1.stop(audioContext.currentTime + 1);
        oscillator2.stop(audioContext.currentTime + 1);
      }, 10000);
    } catch (error) {
      console.log('Audio not supported or blocked');
    }
  };

  // Expose sound functions globally for other components to use
  useEffect(() => {
    window.playTreasureSound = playCollectionSound;
    window.playWinSound = playWinSound;
    window.playLoseSound = playLoseSound;
    window.playBackgroundMusic = playBackgroundMusic;
    
    // Define preferred female voice names globally
    const preferredFemaleNames = [
      'samantha', 'susan', 'karen', 'victoria', 'allison', 'ava', 'serena',
      'zira', 'hazel', 'catherine', 'amelie', 'anna', 'marie', 'paulina',
      'female', 'woman', 'girl', 'lady', 'whisper', 'nova', 'joanna',
      'kimberly', 'salli', 'nicole', 'emma', 'amy', 'raveena', 'ivy',
      'en-au-female', 'en-gb-female', 'en-us-female', 'google us english female',
      'microsoft zira', 'google uk english female', 'natural', 'enhanced'
    ];

    // Store best female voice for reuse
    let cachedFemaleVoice = null;
    let voicesInitialized = false;

    // Preload voices and set up TechDiva voice function
    const initializeTechDivaVoice = () => {
      // Force voices to load
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          
          if (voices.length > 0 && !voicesInitialized) {
            voicesInitialized = true;
            console.log('TechDiva Voice System: Loading', voices.length, 'available voices');
            console.log('Available TTS voices:', voices.map(v => ({
              name: v.name,
              lang: v.lang,
              gender: v.gender,
              voiceURI: v.voiceURI
            })));
            
            // Find and cache the best female voice
            cachedFemaleVoice = findBestFemaleVoice(voices);
            if (cachedFemaleVoice) {
              console.log('TechDiva Voice System: Selected voice:', {
                name: cachedFemaleVoice.name,
                lang: cachedFemaleVoice.lang,
                gender: cachedFemaleVoice.gender
              });
            } else {
              console.warn('TechDiva Voice System: No suitable female voice found, will use default with high pitch');
            }
          }
        };

        // Try to load voices immediately
        loadVoices();
        
        // Also listen for voices changed event (some browsers load asynchronously)
        if (!voicesInitialized) {
          window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
          
          // Cleanup listener after 5 seconds to prevent memory leaks
          setTimeout(() => {
            window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
          }, 5000);
        }
      }
    };

    // Enhanced female voice selection with multiple fallback strategies
    const findBestFemaleVoice = (voices) => {
      if (!voices || voices.length === 0) {
        return null;
      }

      // Strategy 1: Look for specific known female voice names
      for (const name of preferredFemaleNames) {
        const voice = voices.find(v => v.name.toLowerCase().includes(name));
        if (voice) {
          console.log('TechDiva Voice: Found preferred female voice:', voice.name);
          return voice;
        }
      }

      // Strategy 2: Look for voices with explicit gender property
      const explicitFemaleVoice = voices.find(voice => 
        voice.gender === 'female' || 
        (voice.name && voice.name.toLowerCase().includes('female'))
      );
      if (explicitFemaleVoice) {
        console.log('TechDiva Voice: Found explicit female voice:', explicitFemaleVoice.name);
        return explicitFemaleVoice;
      }

      // Strategy 3: Look for voices with higher pitch (usually female)
      const potentialFemaleVoices = voices.filter(voice => {
        const name = voice.name.toLowerCase();
        return (
          name.includes('en') || 
          name.includes('english') ||
          voice.lang.startsWith('en')
        ) && (
          // Avoid obviously male names
          !name.includes('male') &&
          !name.includes('man') &&
          !name.includes('boy') &&
          !name.includes('david') &&
          !name.includes('mark') &&
          !name.includes('alex') &&
          !name.includes('daniel') &&
          !name.includes('john') &&
          !name.includes('thomas') &&
          !name.includes('microsoft david') &&
          !name.includes('google uk english male')
        );
      });

      // Strategy 4: Try to identify female voices by voice URI patterns
      const voiceWithFemalePattern = potentialFemaleVoices.find(voice => {
        const uri = voice.voiceURI || voice.name;
        return uri && (
          uri.includes('female') ||
          uri.includes('woman') ||
          // Some systems use f1, f2 for female voices
          /f[0-9]/.test(uri) ||
          // Some systems use even numbers for female
          /(female|woman|2|4|6|8)/.test(uri)
        );
      });
      if (voiceWithFemalePattern) {
        console.log('TechDiva Voice: Found pattern-based female voice:', voiceWithFemalePattern.name);
        return voiceWithFemalePattern;
      }

      // Strategy 5: In many systems, the second voice is often female
      if (potentialFemaleVoices.length >= 2) {
        console.log('TechDiva Voice: Using second English voice (often female):', potentialFemaleVoices[1].name);
        return potentialFemaleVoices[1];
      }

      // Strategy 6: Default to any English voice and adjust pitch
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') || 
        voice.name.toLowerCase().includes('english')
      );
      if (englishVoice) {
        console.log('TechDiva Voice: Using English voice with high pitch:', englishVoice.name);
        return englishVoice;
      }

      // Strategy 7: Last resort - use default voice with high pitch
      console.log('TechDiva Voice: Using default voice with high pitch:', voices[0]?.name || 'unknown');
      return voices[0] || null;
    };

    initializeTechDivaVoice();
    
    // Enhanced TechDiva voice function with robust female voice selection
    window.speakAsTechDiva = (text, options = {}) => {
      if ('speechSynthesis' in window && !isMuted) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.85; // Slightly slower for clarity
        utterance.pitch = options.pitch || 1.2; // Higher pitch for excitement
        utterance.volume = options.volume || 1.0; // Full volume
        
        // Use cached voice or find best available
        let selectedVoice = cachedFemaleVoice;
        
        if (!selectedVoice) {
          const voices = window.speechSynthesis.getVoices();
          selectedVoice = findBestFemaleVoice(voices);
          cachedFemaleVoice = selectedVoice; // Cache for next time
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('TechDiva speaking with voice:', selectedVoice.name);
          
          // If we couldn't find a definitively female voice, increase pitch more
          const voiceName = selectedVoice.name.toLowerCase();
          const isDefinitelyFemale = preferredFemaleNames.some(name => voiceName.includes(name)) ||
                                   voiceName.includes('female') ||
                                   voiceName.includes('woman');
          
          if (!isDefinitelyFemale) {
            utterance.pitch = Math.min(2.0, (options.pitch || 1.2) + 0.4); // Extra pitch boost for ambiguous voices
            console.log('TechDiva: Boosting pitch to', utterance.pitch, 'for voice:', selectedVoice.name);
          }
        } else {
          console.warn('TechDiva: No voice available, using default with high pitch');
          utterance.pitch = Math.min(2.0, (options.pitch || 1.2) + 0.5); // Maximum pitch boost
        }

        if (options.onStart) utterance.onstart = options.onStart;
        if (options.onEnd) utterance.onEnd = options.onEnd;
        if (options.onError) utterance.onerror = options.onError;

        return new Promise((resolve, reject) => {
          utterance.onend = () => {
            if (options.onEnd) options.onEnd();
            resolve();
          };
          utterance.onerror = (error) => {
            console.warn('TechDiva TTS Error:', error);
            if (options.onError) options.onError(error);
            reject(error);
          };
          
          // Wait for voices to load if necessary
          if (!voicesInitialized) {
            setTimeout(() => {
              const voices = window.speechSynthesis.getVoices();
              if (voices.length > 0) {
                const voice = findBestFemaleVoice(voices);
                if (voice) {
                  utterance.voice = voice;
                  cachedFemaleVoice = voice;
                }
              }
              window.speechSynthesis.speak(utterance);
            }, 500); // Wait 500ms for voices to load
          } else {
            window.speechSynthesis.speak(utterance);
          }
        });
      }
      return Promise.resolve();
    };

    // Add comprehensive voice testing and debugging functions
    window.testTechDivaVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('=== TechDiva Voice Test ===');
      console.log('Total voices available:', voices.length);
      console.log('Voices initialized:', voicesInitialized);
      console.log('Cached female voice:', cachedFemaleVoice?.name || 'None');
      
      if (voices.length > 0) {
        console.log('All available voices:');
        voices.forEach((voice, index) => {
          const isFemale = preferredFemaleNames.some(name => voice.name.toLowerCase().includes(name));
          console.log(`${index + 1}. ${voice.name} (${voice.lang}) ${voice.gender || 'unknown gender'} ${isFemale ? '👩 FEMALE' : ''}`);
        });
        
        const testVoice = cachedFemaleVoice || findBestFemaleVoice(voices);
        if (testVoice) {
          console.log('Testing with voice:', testVoice.name);
          return window.speakAsTechDiva("Hi! I'm TechDiva, and I'm so excited to teach you coding! Can you hear my voice clearly?", {
            onStart: () => console.log('🎤 TechDiva started speaking'),
            onEnd: () => console.log('✅ TechDiva finished speaking'),
            onError: (error) => console.error('❌ TechDiva speech error:', error)
          });
        } else {
          console.error('❌ No suitable voice found for testing');
        }
      } else {
        console.error('❌ No voices available yet - try again in a moment');
      }
      return Promise.resolve();
    };

    // Force reload voices function
    window.reloadTechDivaVoices = () => {
      console.log('🔄 Reloading TechDiva voices...');
      voicesInitialized = false;
      cachedFemaleVoice = null;
      initializeTechDivaVoice();
      setTimeout(() => window.testTechDivaVoice(), 1000);
    };

    // Make TechDiva speak with visual feedback
    window.speakAsTechDivaWithFeedback = (text, options = {}) => {
      const originalOnStart = options.onStart;
      const originalOnEnd = options.onEnd;
      
      return window.speakAsTechDiva(text, {
        ...options,
        onStart: () => {
          // Add visual feedback when TechDiva starts speaking
          document.body.classList.add('techdiva-speaking');
          console.log('🎤 TechDiva started speaking with visual feedback');
          if (originalOnStart) originalOnStart();
        },
        onEnd: () => {
          // Remove visual feedback when TechDiva stops speaking
          document.body.classList.remove('techdiva-speaking');
          console.log('✅ TechDiva finished speaking with visual feedback');
          if (originalOnEnd) originalOnEnd();
        }
      });
    };
  }, [isMuted]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`
          p-3 rounded-full shadow-lg transition-colors
          ${isMuted 
            ? 'bg-gray-500 hover:bg-gray-600' 
            : 'bg-purple-500 hover:bg-purple-600'
          }
          text-white
        `}
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6" />
        ) : (
          <Volume2 className="w-6 h-6" />
        )}
      </button>
      
      {/* Sound indicators */}
      {isPlaying && !isMuted && (
        <div className="absolute -top-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default MusicPlayer;
