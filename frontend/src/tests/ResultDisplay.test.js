import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultDisplay from '../components/ResultDisplay';

// Mock VoiceControls to avoid loading actual browser voice APIs during jest testing
jest.mock('../components/VoiceControls', () => {
  return function MockVoiceControls({ textToRead }) {
    return <div data-testid="voice-controls-playback" data-text={textToRead}>Mock Playback</div>;
  };
});

describe('ResultDisplay Component', () => {
  test('renders nothing when empty props', () => {
    const { container } = render(<ResultDisplay emotion="" rewrittenMessage="" />);
    expect(container.firstChild).toBeNull();
  });

  test('renders just the emotion badge correctly', () => {
    render(<ResultDisplay emotion="joy" rewrittenMessage="" />);
    expect(screen.getByText(/Detected Tone:/i)).toBeInTheDocument();
    expect(screen.getByText('joy')).toBeInTheDocument();
  });

  test('emotion badge applies specific styling classes based on emotion input', () => {
    render(<ResultDisplay emotion="anger" rewrittenMessage="" />);
    const badge = screen.getByText('anger');
    // Using string matching to ensure "red" classes exist in the className
    expect(badge.className).toMatch(/red/);
  });

  test('renders rewritten message properly without emotion', () => {
    const testMessage = "Could you please explain what happened?";
    render(<ResultDisplay emotion="" rewrittenMessage={testMessage} />);
    
    // Quotes are prepended and appended around the message in the UI representation
    expect(screen.getByText(`"${testMessage}"`)).toBeInTheDocument();
    expect(screen.getByText('Rewritten Version')).toBeInTheDocument();
  });

  test('renders both emotion and rewritten message', () => {
    const testMessage = "Let's review the schedule.";
    render(<ResultDisplay emotion="neutral" rewrittenMessage={testMessage} />);
    
    expect(screen.getByText('neutral')).toBeInTheDocument();
    expect(screen.getByText(`"${testMessage}"`)).toBeInTheDocument();
  });

  test('passes correct rewritten text to voice controls', () => {
    const testMessage = "Hello there!";
    render(<ResultDisplay emotion="joy" rewrittenMessage={testMessage} />);
    
    const mockPlayback = screen.getByTestId('voice-controls-playback');
    expect(mockPlayback).toHaveAttribute('data-text', testMessage);
  });
});
