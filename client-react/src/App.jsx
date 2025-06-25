import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes';

// Sample data for demonstration
const sampleItems = [
  {
    idx: '1',
    asset_nm: '샘플 영화 1',
    genre: '액션',
    poster_path: 'https://placehold.co/300x450?text=Movie+1'
  },
  {
    idx: '2',
    asset_nm: '샘플 영화 2',
    genre: '드라마',
    poster_path: 'https://placehold.co/300x450?text=Movie+2'
  },
  {
    idx: '3',
    asset_nm: '샘플 영화 3',
    genre: '코미디',
    poster_path: 'https://placehold.co/300x450?text=Movie+3'
  },
  {
    idx: '4',
    asset_nm: '샘플 영화 4',
    genre: '스릴러',
    poster_path: 'https://placehold.co/300x450?text=Movie+4'
  },
  {
    idx: '5',
    asset_nm: '샘플 영화 5',
    genre: 'SF',
    poster_path: 'https://placehold.co/300x450?text=Movie+5'
  },
  {
    idx: '6',
    asset_nm: '샘플 영화 6',
    genre: '로맨스',
    poster_path: 'https://placehold.co/300x450?text=Movie+6'
  },
  {
    idx: '7',
    asset_nm: '샘플 영화 7',
    genre: '판타지',
    poster_path: 'https://placehold.co/300x450?text=Movie+7'
  }
];

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
