import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { getAvailableVehicleTypes } from './App';

describe('Vehicle Reservation Application', () => {
  // Test 1: User can create a reservation
  test('allows a user to create a reservation', async () => {
    render(<App />);

    // select dates
    fireEvent.change(screen.getByLabelText(/pick-up date/i), {
      target: { value: '2025-08-01' },
    });
    fireEvent.change(screen.getByLabelText(/drop-off date/i), {
      target: { value: '2025-08-05' },
    });

    // choose vehicle
    await userEvent.selectOptions(
      screen.getByLabelText(/vehicle type/i),
      'Sedan'
    );

    // submit
    await userEvent.click(
      screen.getByRole('button', { name: /submit reservation/i })
    );

    // check reservation
    const reservationItem = await screen.findByText(/Pick-up: 2025-08-01/i);
    expect(reservationItem).toBeInTheDocument();
    expect(screen.getByText(/Total Days: 4/i)).toBeInTheDocument();
  });

  // Test 2: Unavailable vehicle not shown
  test('should not show unavailable vehicle types', async () => {
    const initialReservations = [
      {
        id: 1,
        type: 'Sedan',
        pickupDate: '2025-08-01',
        dropoffDate: '2025-08-05',
      },
      {
        id: 2,
        type: 'Sedan',
        pickupDate: '2025-08-02',
        dropoffDate: '2025-08-06',
      },
      {
        id: 3,
        type: 'Sedan',
        pickupDate: '2025-08-03',
        dropoffDate: '2025-08-07',
      },
      {
        id: 4,
        type: 'SUV',
        pickupDate: '2025-08-01',
        dropoffDate: '2025-08-05',
      },
    ];

    render(<App initialReservations={initialReservations} />);

    // Choose dates with sedans booked
    fireEvent.change(screen.getByLabelText(/pick-up date/i), {
      target: { value: '2025-08-04' },
    });
    fireEvent.change(screen.getByLabelText(/drop-off date/i), {
      target: { value: '2025-08-08' },
    });
    
    // Verify SUV / Van only
    const select = screen.getByLabelText(/vehicle type/i);
    const suvOption = await screen.findByRole('option', { name: 'SUV' });

    expect(select).toContainElement(suvOption);
    expect(screen.getByRole('option', { name: 'Van' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Sedan' })
    ).not.toBeInTheDocument();
  });

  // Test 3: Cannot create a reservation if no vehicles are available
  test('should not be able to create a reservation if no vehicles are available', async () => {
    const initialReservations = [
      // 3 Sedans
      {
        id: 1,
        type: 'Sedan',
        pickupDate: '2025-08-01',
        dropoffDate: '2025-08-05',
      },
      {
        id: 2,
        type: 'Sedan',
        pickupDate: '2025-08-02',
        dropoffDate: '2025-08-06',
      },
      {
        id: 3,
        type: 'Sedan',
        pickupDate: '2025-08-03',
        dropoffDate: '2025-08-07',
      },
      // 3 SUVs
      {
        id: 4,
        type: 'SUV',
        pickupDate: '2025-08-01',
        dropoffDate: '2025-08-05',
      },
      {
        id: 5,
        type: 'SUV',
        pickupDate: '2025-08-02',
        dropoffDate: '2025-08-06',
      },
      {
        id: 6,
        type: 'SUV',
        pickupDate: '2025-08-03',
        dropoffDate: '2025-08-07',
      },
      // 3 Vans
      {
        id: 7,
        type: 'Van',
        pickupDate: '2025-08-01',
        dropoffDate: '2025-08-05',
      },
      {
        id: 8,
        type: 'Van',
        pickupDate: '2025-08-02',
        dropoffDate: '2025-08-06',
      },
      {
        id: 9,
        type: 'Van',
        pickupDate: '2025-08-03',
        dropoffDate: '2025-08-07',
      },
    ];
    render(<App initialReservations={initialReservations} />);

    // Select dates that overlap with all reservations
    fireEvent.change(screen.getByLabelText(/pick-up date/i), {
      target: { value: '2025-08-04' },
    });
    fireEvent.change(screen.getByLabelText(/drop-off date/i), {
      target: { value: '2025-08-08' },
    });

    // Dropdown with no vehicles present
    const noVehiclesOption = await screen.findByText(
      /No vehicles available for selected dates/i
    );
    expect(noVehiclesOption).toBeInTheDocument();

    // Submit disabled
    expect(
      screen.getByRole('button', { name: /submit reservation/i })
    ).toBeDisabled();
  });

  // Test 4: Availability calculation with non-overlapping dates
  test('vehicles of same type with non-overlapping dates do not affect availability', () => {
    // Two Sedan reservations that are far apart
    const reservations = [
      {
        id: 1,
        type: 'Sedan',
        pickupDate: '2025-07-03',
        dropoffDate: '2025-07-05',
      },
      {
        id: 2,
        type: 'Sedan',
        pickupDate: '2025-09-07',
        dropoffDate: '2025-09-14',
      },
    ];
    // Dates to check for a new reservation
    const pickupDate = new Date('2025-08-01');
    const dropoffDate = new Date('2025-08-03');

    const availableTypes = getAvailableVehicleTypes(
      pickupDate,
      dropoffDate,
      reservations
    );

    // Sedan should be available because they don't overlap
    expect(availableTypes).toContain('Sedan');
    expect(availableTypes).toEqual(['Sedan', 'SUV', 'Van']);
  });
});
