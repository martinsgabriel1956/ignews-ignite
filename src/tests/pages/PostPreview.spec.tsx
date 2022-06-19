import { render, screen } from "@testing-library/react"
import { useSession } from "next-auth/client"
import { useRouter } from "next/router"
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]"
import { getPrismicClient } from "../../services/prismic"

const post = {
  slug: 'my-new-post',
  title: 'My new post',
  content: '<p>This is my new post</p>',
  updatedAt: 'April, 19'
}

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

describe('Post preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession);
    
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Post post={post} />)

    expect(screen.getByText(post.title)).toBeInTheDocument()
    expect(screen.getByText('This is my new post')).toBeInTheDocument()
    expect(screen.getByText('Wanna Continue Reading?')).toBeInTheDocument()
  })

   it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);

    const pushMock = jest.fn();
    
    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: 'fake-active-subscription'
      },
      false
    ] as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`)
   })

  it('loads initial data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: 'heading',
              text: 'My new post',
            }
          ],
          content: [
            {
              type: 'paragraph',
              text: 'Post excerpt',
            }
          ],
        },
        last_publication_date: '04-19-2022',
      })
    } as any);

    const response = await getStaticProps({
      params: {
        slug: post.slug,
      }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post excerpt</p>',
            updatedAt: '19 de abril de 2022'
          }
        }
      })
    )
  })
})