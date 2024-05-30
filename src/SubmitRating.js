import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';

function SubmitRating() {
  const { breweryId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreweryDetails = async () => {
      try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries/${breweryId}`);
        setBrewery(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching brewery details:', error);
        setLoading(false);
      }
    };

    fetchBreweryDetails();
  }, [breweryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/brewery/${breweryId}/add-rating`, { rating, description });
      navigate(`/brewery`); 
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="submit-rating-container">
      <div className="brewery-info">
        <h2>{brewery.name}</h2>
        <p>{brewery.city}, {brewery.state}</p>
        <p>{brewery.phone}</p>
        <p><a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a></p>
        <div>Rating: {brewery.rating}/5</div>
      </div>
      <div className="rating-section">
        <h3>Submit Rating</h3>
        <form onSubmit={handleSubmit} className="rating-form">
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <button type="submit" className="submit-button">Submit Review</button>
        </form>
      </div>
    </div>
  );
}

export default SubmitRating;
