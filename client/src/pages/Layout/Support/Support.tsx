import { BiSupport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import './Support.css';
export default function Support() {
  return (
    <div className="sup-wrapper">
      <div className="sup-icon">
        <Link to="/support">
          <BiSupport></BiSupport>
        </Link>
      </div>
    </div>
  );
}
