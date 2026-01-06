# SHIELD – Frontend API Documentation

SHIELD is a real-time MicroSOC (Security Operations Center)
that detects, correlates, and blocks cyber attacks in real time.

This document describes the APIs and Socket.io events
consumed by the frontend dashboard.

## Base URL

Local:
http://localhost:8000

Production:
https://api.shield-sec.ai


## Authentication & RBAC

Authentication is JWT-based.

Roles:
- ADMIN
- ANALYST

Frontend must include JWT in Authorization header.

Authorization: Bearer <token>


ADMIN:
- Block IPs
- Assign incidents
- Resolve incidents

ANALYST:
- View incidents
- Investigate logs
- Add notes

## Real-Time Engine (Socket.io)

SHIELD uses Socket.io to push live security events.
Frontend must NOT poll for updates.

### Socket Connection Example

import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  auth: {
    token: "<JWT>"
  }
});

### log:new

Emitted when a new attack is detected.
{
  "attackType": "SQL_INJECTION",
  "severity": "HIGH",
  "ip": "192.168.1.10",
  "endpoint": "/api/auth/login",
  "method": "POST",
  "timestamp": "2026-01-07T10:15:00Z"
}

### incident:new

Emitted when an incident is auto-created.
{
  "incidentId": "INC-1021",
  "severity": "CRITICAL",
  "status": "OPEN",
  "assignedTo": null
}

### incident:update

Emitted when incident status or assignee changes.

{
  "incidentId": "INC-1021",
  "status": "RESOLVED",
  "assignedTo": "analyst_1"
}

### ip:blocked

Emitted when an IP is blocked by the system or admin.
{
  "ip": "192.168.1.10",
  "reason": "Multiple critical attacks",
  "blockedAt": "2026-01-07T10:17:00Z"
}

### Socket Events Summary

| Event Name        | Description                      |
|------------------|----------------------------------|
| log:new          | New attack detected               |
| incident:new     | Incident auto-created             |
| incident:update  | Incident updated / resolved       |
| ip:blocked       | IP blocked by system or admin     |

## Quick Start (Frontend)

1. Create `.env` file in frontend root
2. Add:
   VITE_API_BASE_URL=http://localhost:8000
   VITE_SOCKET_URL=http://localhost:8000
3. Install dependencies
4. Connect Socket.io
5. Start dashboard

## REST APIs (Initial Load Only)

REST APIs are used only to load initial data.
All live updates come via Socket.io.

 Note:
 Detailed REST endpoints will be documented once frontend integration begins.
 Current dashboard relies primarily on real-time Socket.io streams.

## Error Responses

403 Forbidden:
{
  "message": "Your IP is blocked"
}

401 Unauthorized:
{
  "message": "Invalid or expired token"
}

## SHIELD Data Flow

Attack Event
     ↓
Log Created
     ↓
Incident Correlation
     ↓
IP Blocked (if needed)
     ↓
Socket.io Event
     ↓
Frontend Dashboard Update

## Frontend Responsibilities

- Live logs table
- Severity pie chart
- Attack trend line graph
- Incident management console
- Admin IP blocking panel

## Environment Variables (Frontend)

VITE_API_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000

## System Status

 Real-time streaming active  
 Auto-incident creation enabled  
 Role-based access enforced  
 Admin actions live  

 ## Security Note

This project is a simulated MicroSOC for educational and demo purposes.
Attack events are generated via controlled simulators.

