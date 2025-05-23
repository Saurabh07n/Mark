import React, { ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import axios from 'axios'; // Import axios
import {
    PaperclipIcon,
    SendIcon
} from './IconComponents';

// Define message structure (can be moved to types file)
interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

// Define platform names type (can be moved to types file)
type PlatformName = 'Bluesky' | 'Facebook' | 'Google Business' | 'Instagram' | 'X/Twitter' | 'Reddit' | 'Telegram' | 'Threads' | 'TikTok' | 'YouTube';

// --- Define Props Interface ---
interface ChatPanelProps {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    isThinking: boolean;
    setIsThinking: React.Dispatch<React.SetStateAction<boolean>>;
    postTitle: string;
    postContent: string;
    postHashtags: string[];
    mediaUrl: string[];
    socialPlatforms: Record<PlatformName, boolean>;
    postType: { post: boolean; story: boolean; reel: boolean; };
    scheduledDate: string;
    setPostTitle: React.Dispatch<React.SetStateAction<string>>;
    setPostContent: React.Dispatch<React.SetStateAction<string>>;
    setPostHashtags: React.Dispatch<React.SetStateAction<string[]>>;
    setMediaUrl: React.Dispatch<React.SetStateAction<string[]>>;
    // Add setters for socialPlatforms, postType
    setSocialPlatforms: React.Dispatch<React.SetStateAction<Record<PlatformName, boolean>>>;
    setPostType: React.Dispatch<React.SetStateAction<{ post: boolean; story: boolean; reel: boolean; }>>;
    // We might need setScheduledDate later if the API modifies it too
    setScheduledDate: React.Dispatch<React.SetStateAction<string>>;
}

// Use props instead of local state
const ChatPanel: React.FC<ChatPanelProps> = ({ 
    messages, setMessages,
    isThinking, setIsThinking,
    postTitle, postContent, postHashtags, mediaUrl, socialPlatforms, postType, scheduledDate,
    setPostTitle, setPostContent, setPostHashtags, setMediaUrl,
    // Destructure new props
    setSocialPlatforms, setPostType, setScheduledDate 
}) => {
    // Local state only for the input field value
    const [inputValue, setInputValue] = React.useState(''); 
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const chatPanelBg = 'bg-[#11132f]';
    const chatHeaderBorder = 'border-gray-600/60';
    const chatInputBorder = 'border-[#475569]/50';
    const chatInputBg = 'bg-[#334155]/50';
    const messagePlaceholderColor = 'text-gray-400';
    const sendButtonBg = 'bg-blue-600';
    const chatBubbleGradient = 'bg-gradient-to-r from-[#3b82f6] to-[#2563eb]';
    const userChatBubbleBg = 'bg-white';
    const userChatBubbleText = 'text-gray-700';

    // Initialize chat with first AI message - Use props now
    // --- Restore Initial API Call Logic ---
    useEffect(() => {
        // Only run if messages are defined and empty initially
        if (messages && messages.length === 0) { 
            setIsThinking(true);

            // Construct the initial request body using props
            const initialRequestBody = {
                sessionId: "test-session-initial", // Use a specific initial session ID
                userId: 103,                 // Hardcoded
                message: "Hi There!",      // Initial greeting message
                post: {
                  userId: 123,              // Hardcoded as per example
                  title: postTitle,         // Use initial prop value
                  content: postContent,     // Use initial prop value
                  mediaUrl: mediaUrl,         // Use initial prop value
                  hashtags: postHashtags,     // Use initial prop value
                  socialPlatforms: socialPlatforms, // Use initial prop value
                  postType: { post: postType.post, story: postType.story, reel: postType.reel }, // Use new keys
                  scheduledDate: scheduledDate  // Use initial prop value
                }
              };

            axios.post(
                'https://5jsanjhv.rpcl.app/webhook/fcc407ed-9e48-44d0-a1cd-81773a0f4073',
                initialRequestBody, // Send the structured body
                { headers: { 'Content-Type': 'application/json' } }
            )
            .then(response => {
                setIsThinking(false);
                const responseData = response.data;
                // Expecting { output: { message: "...", post: { ... } } }
                if (responseData?.output?.post && responseData?.output?.message) {
                    const { message: aiMessageContent, post: initialPost } = responseData.output;
                    
                    // Update post state from initial response
                    setPostTitle(initialPost.title ?? ''); 
                    setPostContent(initialPost.content ?? '');
                    setPostHashtags(initialPost.hashtags ?? []);
                    setMediaUrl(initialPost.mediaUrl ?? []);
                    // Update toggles if API provides them initially
                    if (initialPost.socialPlatforms) setSocialPlatforms(initialPost.socialPlatforms);
                    if (initialPost.postType) {
                        const apiPostType = initialPost.postType as any; // Cast to allow any keys
                        console.log('[ChatPanel] Received from API (initial) - raw apiPostType:', apiPostType);
                        const transformedPostType = {
                            post: apiPostType.Post ?? false,      // Directly use Post, default to false
                            story: apiPostType.Story ?? false,     // Directly use Story, default to false
                            reel: apiPostType.reel ?? false,      // Directly use reel, default to false
                        };
                        console.log('[ChatPanel] Transformed postType for state update (initial):', transformedPostType);
                        setPostType(transformedPostType);
                    }
                    if (initialPost.scheduledDate) setScheduledDate(initialPost.scheduledDate);

                    // Set the initial AI message
                    const aiResponseMessage: Message = {
                        id: Date.now(),
                        text: aiMessageContent,
                        sender: 'ai'
                    };
                    setMessages([aiResponseMessage]); // Use prop setter

                } else {
                    // Handle potential invalid format in initial call
                    console.error('Initial API Error: Invalid response format', responseData);
                    const aiErrorResponse: Message = {
                        id: Date.now(),
                        text: 'Error: Received invalid initial response format.',
                        sender: 'ai'
                    };
                    setMessages([aiErrorResponse]);
                }
            })
            .catch(error => {
                setIsThinking(false);
                console.error('Initial API call error:', error);
                const errorMessage = 'Sorry, I couldn\'t connect. Please try again later.';
                const aiErrorResponse: Message = {
                    id: Date.now(),
                    text: errorMessage,
                    sender: 'ai'
                };
                setMessages([aiErrorResponse]); // Use prop setter
            });
        }
    // Add props used inside useEffect to dependency array for correctness,
    // but only if they should trigger a re-fetch if they change *after* initial load.
    // Since this should likely only run ONCE, keep the dependency array empty.
    }, []); 
    // --- End Initial API Call Logic ---

    // Scroll to bottom whenever messages change - Use props
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Depend on messages prop

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    // Use props in handleSend
    const handleSend = async () => {
        const messageText = inputValue.trim();
        if (messageText) {
            const newMessage: Message = {
                id: Date.now(), 
                text: messageText,
                sender: 'user'
            };
            setMessages(prevMessages => [...prevMessages, newMessage]); // Use prop setter
            setInputValue('');

            const textarea = document.getElementById('chat-textarea') as HTMLTextAreaElement;
            if (textarea) {
                textarea.style.height = 'auto';
            }

            setIsThinking(true); // Use prop setter

            try {
                const requestBody = {
                    sessionId: "test-session-3",
                    userId: 103,
                    message: messageText,
                    post: {
                      userId: 123,
                      // Read post details from props
                      title: postTitle,
                      content: postContent,
                      mediaUrl: mediaUrl, 
                      hashtags: postHashtags,
                      socialPlatforms: socialPlatforms,
                      postType: { post: postType.post, story: postType.story, reel: postType.reel }, // Use new keys
                      scheduledDate: scheduledDate
                    }
                  };
                console.log('[ChatPanel] Sending to API - postType:', requestBody.post.postType);

                const response = await axios.post(
                    'https://5jsanjhv.rpcl.app/webhook/fcc407ed-9e48-44d0-a1cd-81773a0f4073',
                    requestBody,
                    { headers: { 'Content-Type': 'application/json' } }
                );

                console.log("API Response Data:", response.data);

                setIsThinking(false); // Use prop setter
                const responseData = response.data;

                if (responseData?.output?.post && responseData?.output?.message) {
                    const { message: aiMessageContent, post: updatedPost } = responseData.output;

                    // Update post state using prop setters
                    setPostTitle(updatedPost.title ?? ''); 
                    setPostContent(updatedPost.content ?? '');
                    setPostHashtags(updatedPost.hashtags ?? []); 
                    setMediaUrl(updatedPost.mediaUrl ?? []); 
                    // Update toggles if API provides them
                    if (updatedPost.socialPlatforms) setSocialPlatforms(updatedPost.socialPlatforms);
                    if (updatedPost.postType) {
                        const apiPostType = updatedPost.postType as any; // Cast to allow any keys
                        console.log('[ChatPanel] Received from API - raw apiPostType:', apiPostType);
                        const transformedPostType = {
                            post: apiPostType.Post ?? false,      // Directly use Post, default to false
                            story: apiPostType.Story ?? false,     // Directly use Story, default to false
                            reel: apiPostType.reel ?? false,      // Directly use reel, default to false
                        };
                        console.log('[ChatPanel] Transformed postType for state update:', transformedPostType);
                        setPostType(transformedPostType);
                    }
                    if (updatedPost.scheduledDate) setScheduledDate(updatedPost.scheduledDate);

                    const aiResponseMessage: Message = {
                        id: Date.now() + 1,
                        text: aiMessageContent,
                        sender: 'ai'
                    };
                    setMessages(prev => [...prev, aiResponseMessage]); // Use prop setter

                } else {
                    console.error('API Error: Invalid response format', responseData);
                    const aiErrorResponse: Message = {
                        id: Date.now() + 1,
                        text: 'Error: Received invalid response format from AI.',
                        sender: 'ai'
                    };
                    setMessages(prev => [...prev, aiErrorResponse]); // Use prop setter
                }

            } catch (error) {
                setIsThinking(false); // Use prop setter
                console.error('Axios Error:', error);
                let errorMessage = 'Error: Could not connect to the AI service.';
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        errorMessage = `Error: Could not get response (${error.response.status})`;
                    } else if (error.request) {
                        errorMessage = 'Error: No response received from AI service.';
                    } else {
                         errorMessage = `Error: ${error.message}`;
                    }
                } 

                const aiErrorResponse: Message = {
                    id: Date.now() + 1,
                    text: errorMessage,
                    sender: 'ai'
                };
                setMessages(prev => [...prev, aiErrorResponse]); // Use prop setter
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Render using props
    return (
        <div className={`relative flex flex-col ${chatPanelBg} text-white border-r-2 border-gray-800 h-full overflow-hidden`}>
            <div className={`h-[54px] flex items-center px-5 border-b ${chatHeaderBorder} shrink-0`}>
                <h2 className="font-semibold text-sm">Chat with Mark</h2>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
                {(messages || []).map((message) => ( // Use messages from props, add fallback
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-lg max-w-[85%] md:max-w-[80%] shadow-md text-sm ${message.sender === 'user'
                            ? `${userChatBubbleBg} ${userChatBubbleText}`
                            : `${chatBubbleGradient} text-white`
                            }`}>
                            {message.text.split('\n').map((line, index) => (
                                <span key={index}>{line}<br /></span>
                            ))}
                        </div>
                    </div>
                ))}
                
                {/* Use isThinking from props */}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className={`px-4 py-2 rounded-lg max-w-[85%] md:max-w-[80%] shadow-md text-sm ${chatBubbleGradient} text-white`}>
                            Thinking...
                        </div>
                    </div>
                )}
            </div>
            
            {/* Input area - unchanged, uses local inputValue state */}
            <div className={`p-4 border-t ${chatInputBorder} shrink-0`}>
                 {/* ... input textarea and send button ... */}
                 <div className={`flex items-end ${chatInputBg} rounded-xl border ${chatInputBorder} px-4 py-2`}> 
                    <textarea
                        id="chat-textarea"
                        rows={1}
                        placeholder="Type your message..."
                        className={`flex-1 bg-transparent ${messagePlaceholderColor} text-sm focus:outline-none resize-none py-1.5 placeholder-gray-400 max-h-24 overflow-y-auto`}
                        style={{ scrollbarWidth: 'none' }}
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className={`ml-3 ${sendButtonBg} rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-blue-700 flex-shrink-0 self-center mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isThinking} // Disable send when thinking
                    >
                        <SendIcon className="w-5 h-5 transform rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;