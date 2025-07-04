# Initial Instructions

1. Recommended time for this task is 2-4 hours.
2. You can use any language you prefer for this exercise.
3. The system should allow reservation of a car of a given type at a desired date and time for a
given number of days.
4. There are 3 types of cars (sedan, SUV and van).
5. The number of cars of each type is limited.
6. Use unit tests to prove the system satisfies the requirements.
7. Please be prepared to discuss the design and implementation during the interview.

# Though Process / Walkthrough

- Went through the initial instructions, created a quick proof of what I thought might suffice for the contstraints
- Cleaned up the errors, fixed the tests cases, verified and confirmed the conditions; the application met all of them.
- Used the genereated PoC to iron out what the application should actually do and what it should and shouldn't be capable of.
- Initially my only real constraints were 3 vehicles total of each type, and all requirements must have unit tests. I considered those breaking to be failure points. The first being physical inventory availability, the second being...well, it's a test after all, this application needs to function.
- Also, at first I didn't care about only selecting duration, but creating a reservation feature, even minimally felt more realized when overlapping reservations factored against the inventory constraint.
- After the constraints I laid out what the actual Refined Instruction set looked like and then created my User Paths
- Generated new scaffold, fixed date errors in calendar, fixed testing errors, fixed needlessly complicated file structure (similar to GemCRD), validated user paths and constraints

# Application Constraints:

- 3 of each vehicle total are available
- Vehicles of the same type without overlapping reservation dates do not count towards remaining vehicle total; For example; If there were 2 reservations, 07/03-07/05 - Sedan & 07/07-07/14 - Sedan, there would still result in 3 total Sedans for availability if you were booking for 08/01-08/03.
- All requirements must have unit tests

# Refined Instructions

1. Allow user to create reservation for a vehicle
2. Allow user to specify type of vehicle
3. Allow user to specify number of days
4. 3 types of vehicles; sedan, SUV, van
5. Total number of each car is limited; 3 total of each
6. Unit tests for above constraints

# User Paths:

## As a user / A user:

- [X] I want to be able to create a reservation for a vehicle

- [X] I want to select the duration of my reservation via a calendar
- [X] Pick up Date & Drop off Date

- [X] Should not be shown unavailable vehicle types

- [X] Should not be able to create a reservation if no vehicles are available

# Application Flow

1. Choose Dates
2. Choose Vehicle Type
3. Submit Reservation
4. Display existing reservations; Vehicle Type, Pickup Date, Dropoff Date, Total Days

