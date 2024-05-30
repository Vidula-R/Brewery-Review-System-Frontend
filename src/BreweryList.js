import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Header() {
  return (
    <nav className="header">
      <h1>GET YOUR BREWERY</h1>
      <Link to="/" className="logout-icon">
        <i className="fas fa-sign-out-alt"></i>
      </Link>
    </nav>
  );
}

function Footer() {
  return (
    <div className="footer">
      &copy; 2024 My Brewery App
    </div>
  );
}

function BreweryList() {
  const [breweries, setBreweries] = useState([]);
  const [filters, setFilters] = useState({
    filterType: 'city',
    filterValue: '',
    perPage: 10
  });

  useEffect(() => {
    const fetchAllBreweries = async () => {
      try {
        const response = await fetch('https://api.openbrewerydb.org/v1/breweries');
        const data = await response.json();

        const breweriesWithRatings = await Promise.all(data.map(async (brewery) => {
          try {
            const ratingResponse = await axios.get(`http://localhost:5000/brewery/${brewery.id}/rating`);
            return { ...brewery, rating: ratingResponse.data.rating || 0 }; // Default to 0 if no rating
          } catch (error) {
            console.error('Error fetching rating for brewery:', brewery.id, error);
            return { ...brewery, rating: 0 };
          }
        }));

        setBreweries(breweriesWithRatings);
      } catch (error) {
        console.error('Error fetching breweries:', error);
      }
    };

    fetchAllBreweries();
  }, []);

  const fetchFilteredBreweries = async () => {
    const { filterType, filterValue, perPage } = filters;
    let url = `https://api.openbrewerydb.org/v1/breweries?per_page=${perPage}`;

    if (filterValue) {
      url += `&by_${filterType}=${encodeURIComponent(filterValue)}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      const breweriesWithRatings = await Promise.all(data.map(async (brewery) => {
        try {
          const ratingResponse = await axios.get(`http://localhost:5000/brewery/${brewery.id}/ratings`);
          return { ...brewery, rating: ratingResponse.data.rating || 0 }; // Default to 0 if no rating
        } catch (error) {
          console.error('Error fetching rating for brewery:', brewery.id, error);
          return { ...brewery, rating: 0 };
        }
      }));

      setBreweries(breweriesWithRatings);
    } catch (error) {
      console.error('Error fetching filtered breweries:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFilteredBreweries();
  };

  return (
    <div className="brewery">
      <Header />
      <br></br>
      <div className="filter-style">
        <form onSubmit={handleSubmit} className="filter-form">
          <select
            name="filterType"
            value={filters.filterType}
            onChange={handleChange}
          >
            <option value="city">City</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
          </select>
          <input
            type="text"
            name="filterValue"
            value={filters.filterValue}
            onChange={handleChange}
            placeholder={`Filter by ${filters.filterType}`}
          />
          <input
            type="number"
            name="perPage"
            value={filters.perPage}
            onChange={handleChange}
            placeholder="Results per page"
            min="1"
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <div className="brewery-grid">
        {breweries.map(brewery => (
          <div key={brewery.id} className="brewery-card">
            <h3>{brewery.name}</h3>
            <p>{brewery.city}, {brewery.state}</p>
            <p>{brewery.phone}</p>
            <p><a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a></p>
            <div>Rating: {brewery.rating}/5</div>
            <br></br>
            <Link to={`/brewery/${brewery.id}/submit-review`}>Submit Review</Link>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default BreweryList;
