//Ai generated test (waste of time)
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostPage from './PostPage'
import { MemoryRouter } from 'react-router-dom'
import useConfig from '../../../hooks/useConfig'

// Mock hooks
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal(); // Get all original exports
  return {
    ...actual, // Spread all original exports
    useParams: () => ({ _id: '123' }) // Only override useParams
  };
});

vi.mock('../../../hooks/useConfig', () => ({
   default: () => ({
    config: { serverURL: 'http://test.server' }
  })
}))

const mockShowToast = vi.fn();

// 2. Mock the module with the default export
vi.mock('../../../hooks/useToast', () => ({
  __esModule: true, // This helps with default imports
  default: () => ({
    showToast: mockShowToast
  })
}));


describe('PostPage Component', () => {
beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        title: 'Test Car',
        price: 15000,
        images: []
      }),
    })
  );
});


  // test('renders loading state initially', () => {
  //   render(
  //     <MemoryRouter initialEntries={['/post/123']}>
  //       <PostPage />
  //     </MemoryRouter>
  //   )
    
  //   expect(screen.getByText(/loading/i)).toBeInTheDocument()
  // })

  test('fetches post data on mount with correct URL', async () => {
    const mockData = {
      title: 'Test Post',
      price: 1000,
      images: []
    }
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    )

    render(
      <MemoryRouter initialEntries={['/post/123']}>
        <PostPage />
      </MemoryRouter>
    )
await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      'http://test.server/post/123?include=bids,comments'
    );
  })})
    

  test('displays no photos when images array is empty', async () => {
    const mockData = {
      title: 'Test Post',
      price: 1000,
      images: []
    }
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    )

    render(
      <MemoryRouter initialEntries={['/post/123']}>
        <PostPage />
      </MemoryRouter>
    )

  await waitFor(() => {
    const noPhotosElement = screen.getByText(/no photos/i);
    expect(noPhotosElement).toBeInTheDocument();
    })
  })

  test('displays error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    )

    render(
      <MemoryRouter initialEntries={['/post/123']}>
        <PostPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      // expect(screen.getByText(/Failed/i)).toBeInTheDocument()
    expect(mockShowToast).toHaveBeenCalledWith(
  expect.stringContaining('Failed to load post data'),
  'error'
);
    })
  })

  test('displays all post details correctly', async () => {
    const mockData = {
      title: 'Test Car',
      price: 15000,
      images: [],
      car:{
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      mileage: 150000,
      condition: 'Excellent',
      fuel: 'Petrol',
      hp: 120,
      transmission: 'Automatic',
      bodyType: 'Sedan',
      },
      address: '123 Test St',
      desc: 'Test description'
    }
    
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    )

    render(
      <MemoryRouter initialEntries={['/post/123']}>
        <PostPage />
      </MemoryRouter>
    )
  await waitFor(() => {
    // Test all string/number values
    const textValues = {
      make: 'Toyota',
      model: 'Corolla',
      year: '2020',
      mileage: '150,000',
      condition: 'Excellent',
      fuel: 'Petrol',
      hp: '120',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      address: '123 Test St',
      desc: 'Test description'
    };

    Object.entries(textValues).forEach(([key, value]) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    // Test price formatting separately
    expect(screen.getByText('$15,000')).toBeInTheDocument();
    })
  })
})