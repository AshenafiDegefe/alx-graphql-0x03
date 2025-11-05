import { useQuery } from "@apollo/client/react"
import { GET_EPISODES } from "@/graphql/queries"
import { EpisodeProps } from "@/interfaces"
import EpisodeCard from "@/components/common/EpisodeCard"
import { useEffect, useState } from "react"
import React from 'react' // Import React for React.FC

// --- New Interfaces ---

interface PageInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

interface GetEpisodesData {
  // This must match the root field returned by your GraphQL query
  episodes: {
    info: PageInfo;
    // EpisodeProps is used as the item type for the results array
    results: EpisodeProps[];
  };
}

interface GetEpisodesVariables {
  page: number;
}

// ----------------------


const Home: React.FC = () => {

  const [page, setPage] = useState<number>(1)
  
  // Apply the types here!
  const { loading, error, data, refetch } = useQuery<GetEpisodesData, GetEpisodesVariables>(GET_EPISODES, {
    variables: {
      page: page
    }
  })

  useEffect(() => {
    // Note: refetch is guaranteed to be stable from Apollo, so putting it in the
    // dependency array is often correct, but Apollo may suggest alternatives.
    refetch()
  }, [page, refetch]) 

  if (loading) return <h1>Loading...</h1>
  if (error) return <h1>Error</h1>

  // Safely destructure now that TypeScript knows the structure
  // Use optional chaining just in case data is briefly undefined/null between states
  const results = data?.episodes.results
  const info = data?.episodes.info

  // Ensure 'info' is available before trying to access 'info.pages' in the Next button
  const hasInfo = !!info;


  return (
    <div className="min-h-screen flex flex-col bg gradient-to-b from-[#A3D5E0] to-[#F4F4F4] text-gray-800">
      {/* Header */}
      <header className="bg-[#4CA1AF] text-white py-6 text-center shadow-md">
        <h1 className="text-4xl font-bold tracking-wide">Rick and Morty Episodes</h1>
        <p className="mt-2 text-lg italic">Explore the multiverse of adventures!</p>
      </header>

      {/* Main Content */}
      <main className="flex grow p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results && results.map((episodeData, key) => (
            <EpisodeCard
              {...episodeData} // Cleaner way to pass all properties from EpisodeProps
              key={key}
            />
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => setPage(prev => prev > 1 ? prev - 1 : 1)}
            // Disable if on the first page
            disabled={page === 1}
            className={`font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-200 transform ${page === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#45B69C] text-white hover:bg-[#3D9B80] hover:scale-105'}`}>
            Previous
          </button>
          
          <button 
            onClick={() => setPage(prev => hasInfo && prev < info.pages ? prev + 1 : prev)}
            // Disable if on the last page
            disabled={!hasInfo || page === info.pages}
            className={`font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-200 transform ${!hasInfo || page === info.pages ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#45B69C] text-white hover:bg-[#3D9B80] hover:scale-105'}`}>
            Next
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#4CA1AF] text-white py-4 text-center shadow-md">
        <p>&copy; 2024 Rick and Morty Fan Page</p>
      </footer>
    </div>
  )
}

export default Home;