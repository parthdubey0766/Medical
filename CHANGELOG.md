# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-06-02

### Added
- **Admin Dashboard**: Created a secure `/admin` page (password protected) for the doctor to manage and view all appointments and contact messages directly on the website without needing to log into the Firebase Console.
- **Form Defaults**: Contact, Booking, and Data Request forms now automatically pre-fill `+91-` for convenience.

### Changed
- **Project Name**: Renamed the project identifier to `medical-clenic`.
- **Clinic Branding**: Globally rebranded the application from "Dr. Sharma's Clinic" to "Parth's Clinic" (including all metadata, footers, headers, mock data, and emails).
- **Validation**: Enforced a strict maximum age limit of 120 and made the age field required on the booking form.
- **Validation**: Strict Indian phone number enforcement applied across the backend schemas and frontend. Numbers must now start with `+91`.

### Removed
- **Clinic Tour**: Removed the 3D walkthrough Clinic Tour from the Gallery page and uninstalled all associated 3D rendering dependencies (three, @react-three/fiber, etc.).
