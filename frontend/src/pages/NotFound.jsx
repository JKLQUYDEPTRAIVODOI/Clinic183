import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Không tìm thấy trang</h1>
        <p className="text-lg text-gray-600 mb-8">
          Trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Button 
          variant="primary" 
          className="px-6 py-2"
          onClick={() => navigate('/')}
        >
          Về trang chủ
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;