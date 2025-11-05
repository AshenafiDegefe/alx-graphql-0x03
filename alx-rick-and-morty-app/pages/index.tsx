import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorProneComponent from '@/components/ErrorProneComponent';

const Home: React.FC = () => {
  return (
    <ErrorBoundary>
      <ErrorProneComponent />
    </ErrorBoundary>
  );
};

export default Home;