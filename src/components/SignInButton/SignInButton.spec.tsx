import { render, screen } from "@testing-library/react";
import { useSession } from 'next-auth/client';
import { SignInButton } from ".";

jest.mock('next-auth/client')

describe('SignInButton component', () => {
  it('renders correctly when user is not sign in', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);
    
    render(
      <SignInButton />
    );
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  })
  
  it('renders correctly when user is sign in', () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValue([
      {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        expires: 'fake-expires'
      }, 
      false
    ]);
    
    render(
      <SignInButton />
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  })
})
