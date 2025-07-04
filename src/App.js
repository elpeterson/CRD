import React, { useState, useMemo } from 'react';
import {
  format,
  parseISO,
  isBefore,
  isAfter,
  differenceInDays,
} from 'date-fns';

// layout initial constraints
const VEHICLE_TYPES = ['Sedan', 'SUV', 'Van'];
const TOTAL_INVENTORY_PER_TYPE = 3;

export const getAvailableVehicleTypes = (
  pickupDate,
  dropoffDate,
  reservations
) => {
  if (!pickupDate || !dropoffDate) return [];
  if (isNaN(pickupDate.getTime()) || isNaN(dropoffDate.getTime())) return [];

  const availableTypes = VEHICLE_TYPES.filter((type) => {
    // any reservations overlapping?
    const overlappingReservations = reservations.filter(
      (res) =>
        res.type === type &&
        isBefore(parseISO(res.pickupDate), dropoffDate) &&
        isAfter(parseISO(res.dropoffDate), pickupDate)
    ).length;

    return TOTAL_INVENTORY_PER_TYPE - overlappingReservations > 0;
  });

  return availableTypes;
};

function App({ initialReservations = [] }) {
  const [pickupDate, setPickupDate] = useState(null);
  const [dropoffDate, setDropoffDate] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [reservations, setReservations] = useState(initialReservations);
  const [error, setError] = useState('');

  // keeps vehicles available
  const availableTypes = useMemo(
    () => getAvailableVehicleTypes(pickupDate, dropoffDate, reservations),
    [pickupDate, dropoffDate, reservations]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // errors
    if (!pickupDate || !dropoffDate || !selectedVehicle) {
      setError('Please fill out all fields.');
      return;
    }
    if (!isAfter(dropoffDate, pickupDate)) {
      setError('Drop-off date must be after pick-up date.');
      return;
    }
    // last vehcile check
    if (!availableTypes.includes(selectedVehicle)) {
      setError(
        'The selected vehicle type is no longer available for these dates.'
      );
      return;
    }

    // create reservation
    const newReservation = {
      id: Date.now(), 
      type: selectedVehicle,
      pickupDate: format(pickupDate, 'yyyy-MM-dd'),
      dropoffDate: format(dropoffDate, 'yyyy-MM-dd'),
    };
    setReservations([...reservations, newReservation]);

    // reset
    setPickupDate(null);
    setDropoffDate(null);
    setSelectedVehicle('');
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'sans-serif',
        maxWidth: '600px',
        margin: 'auto',
      }}
    >
      <h1>Vehicle Reservation</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '5px',
        }}
      >
        <div>
          <label htmlFor="pickup" style={{ marginRight: '10px' }}>
            Pick-up Date:
          </label>
          <input
            type="date"
            id="pickup"
            onChange={(e) =>
              setPickupDate(e.target.value ? parseISO(e.target.value) : null)
            }
            value={pickupDate ? format(pickupDate, 'yyyy-MM-dd') : ''}
          />
        </div>
        <div>
          <label htmlFor="dropoff" style={{ marginRight: '10px' }}>
            Drop-off Date:
          </label>
          <input
            type="date"
            id="dropoff"
            onChange={(e) =>
              setDropoffDate(e.target.value ? parseISO(e.target.value) : null)
            }
            value={dropoffDate ? format(dropoffDate, 'yyyy-MM-dd') : ''}
          />
        </div>
        <div>
          <label htmlFor="vehicle" style={{ marginRight: '10px' }}>
            Vehicle Type:
          </label>
          <select
            id="vehicle"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            disabled={!pickupDate || !dropoffDate}
          >
            <option value="">-- Select Vehicle --</option>
            {/* Logic change: Only show 'No vehicles' if dates are selected */}
            {pickupDate && dropoffDate && availableTypes.length === 0 ? (
              <option disabled>No vehicles available for selected dates</option>
            ) : (
              availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))
            )}
          </select>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={!selectedVehicle}>
          Submit Reservation
        </button>
      </form>

      <h2 style={{ marginTop: '40px' }}>Existing Reservations</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reservations.length > 0 ? (
          reservations.map((res) => {
            const totalDays = differenceInDays(
              parseISO(res.dropoffDate),
              parseISO(res.pickupDate)
            );
            return (
              <li
                key={res.id}
                style={{
                  border: '1px solid #eee',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
              >
                <strong>{res.type}</strong> | Pick-up: {res.pickupDate} |
                Drop-off: {res.dropoffDate} | Total Days: {totalDays}
              </li>
            );
          })
        ) : (
          <p>No reservations yet.</p>
        )}
      </ul>
    </div>
  );
}

export default App;
