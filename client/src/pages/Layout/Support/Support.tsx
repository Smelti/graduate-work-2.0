import { BiSupport } from 'react-icons/bi';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import SupportModal from './SupportModal/SupportModal';
import SupportModalManager from '../../admin/SupportModalManager/SupportModalManager';
import './Support.css';

export default function Support() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const isManager = user?.role === 'manager' || user?.role === 'admin';

  return (
    <>
      <div className="sup-wrapper" onClick={() => setIsModalOpen(true)}>
        <div className="sup-icon">
          <BiSupport />
        </div>
      </div>
      {isManager ? (
        <SupportModalManager
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      ) : (
        <SupportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
