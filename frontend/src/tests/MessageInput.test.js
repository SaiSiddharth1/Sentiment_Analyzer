import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageInput from '../components/MessageInput';

// Mock the VoiceControls component since we don't need to test browser audio APIs here
jest.mock('../components/VoiceControls', () => {
  return function MockVoiceControls() {
    return <div data-testid="voice-controls-mock">Voice Controls</div>;
  };
});

describe('MessageInput Component', () => {
  const mockSetText = jest.fn();
  const mockOnDetect = jest.fn();
  const mockOnRewrite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders text area and buttons correctly', () => {
    render(
      <MessageInput 
        text="" 
        setText={mockSetText} 
        onDetect={mockOnDetect} 
        onRewrite={mockOnRewrite} 
        isDetecting={false} 
        isRewriting={false} 
      />
    );

    expect(screen.getByPlaceholderText(/Type or speak a message that might sound rude/i)).toBeInTheDocument();
    expect(screen.getByText('Detect Emotion')).toBeInTheDocument();
    expect(screen.getByText('Rewrite Message')).toBeInTheDocument();
  });

  test('disables buttons when input is empty', () => {
    render(
      <MessageInput 
        text="   " 
        setText={mockSetText} 
        onDetect={mockOnDetect} 
        onRewrite={mockOnRewrite} 
        isDetecting={false} 
        isRewriting={false} 
      />
    );

    expect(screen.getByText('Detect Emotion')).toBeDisabled();
    expect(screen.getByText('Rewrite Message')).toBeDisabled();
  });

  test('calls appropriate functions on button click', () => {
    render(
      <MessageInput 
        text="This is an angry message!" 
        setText={mockSetText} 
        onDetect={mockOnDetect} 
        onRewrite={mockOnRewrite} 
        isDetecting={false} 
        isRewriting={false} 
      />
    );

    const detectBtn = screen.getByText('Detect Emotion');
    const rewriteBtn = screen.getByText('Rewrite Message');

    expect(detectBtn).not.toBeDisabled();
    expect(rewriteBtn).not.toBeDisabled();

    fireEvent.click(detectBtn);
    expect(mockOnDetect).toHaveBeenCalledTimes(1);

    fireEvent.click(rewriteBtn);
    expect(mockOnRewrite).toHaveBeenCalledTimes(1);
  });

  test('updates text on typing', () => {
    render(
      <MessageInput 
        text="" 
        setText={mockSetText} 
        onDetect={mockOnDetect} 
        onRewrite={mockOnRewrite} 
        isDetecting={false} 
        isRewriting={false} 
      />
    );

    const textarea = screen.getByPlaceholderText(/Type or speak a message that might sound rude/i);
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    expect(mockSetText).toHaveBeenCalledWith('Hello');
  });

  test('disables buttons during loading state', () => {
    const { rerender } = render(
      <MessageInput 
        text="Hello" 
        setText={mockSetText} 
        onDetect={mockOnDetect} 
        onRewrite={mockOnRewrite} 
        isDetecting={true} 
        isRewriting={false} 
      />
    );

    expect(screen.getByText('Detecting...')).toBeDisabled();
    expect(screen.getByText('Rewrite Message')).toBeDisabled();

    rerender(
      <MessageInput 
        text="Hello" 
        setText={mockSetText} 
        onDetect={mockOnDetect} 
        onRewrite={mockOnRewrite} 
        isDetecting={false} 
        isRewriting={true} 
      />
    );

    expect(screen.getByText('Detect Emotion')).toBeDisabled();
    expect(screen.getByText('Rewriting...')).toBeDisabled();
  });
});
