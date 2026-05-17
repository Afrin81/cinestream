# Data Flow Diagrams (DFD) for Movie Management System

This document contains the Data Flow Diagrams (DFD) for the Movie Management System, detailing the flow of data between external entities, system processes, and data stores. The diagrams are created using Mermaid JS.

## Level 0 DFD (Context Diagram)
The Level 0 DFD shows the entire system as a single process and illustrates its interactions with external entities (Users, Admins, and Payment Gateways).

```mermaid
flowchart TD
    %% Entities
    User[User]
    Admin[Admin]
    PG[Payment Gateway]

    %% Main System
    System((0.0 Movie Management System))

    %% User Flows
    User -->|Registration/Login Data, Search Queries, Payment Requests| System
    System -->|Movie Content, Video Streams, Auth Tokens, Payment Confirmations| User

    %% Admin Flows
    Admin -->|Movie Updates, User Management Actions| System
    System -->|System Statistics, User Reports| Admin

    %% Payment Gateway Flows
    System -->|Transaction Requests, Amount Details| PG
    PG -->|Payment Status, IPN Notifications| System
```

---

## Level 1 DFD (Main Processes)
The Level 1 DFD breaks down the main system into major sub-processes, showing how data moves between these processes and the data stores (Databases).

```mermaid
flowchart TD
    %% External Entities
    User[User]
    Admin[Admin]
    PG[Payment Gateway]

    %% Processes
    P1((1.0 User Authentication))
    P2((2.0 Movie Browsing & Streaming))
    P3((3.0 Payment Processing))
    P4((4.0 Admin Management))

    %% Data Stores
    D1[(D1: Users DB)]
    D2[(D2: Movies DB)]

    %% 1.0 User Authentication
    User -->|Credentials, Profile Data| P1
    P1 -->|Auth Token, User Details| User
    P1 <-->|Read/Write User Data| D1

    %% 2.0 Movie Browsing & Streaming
    User -->|Search Queries, Filter Requests| P2
    P2 -->|Movie Details, Video Stream| User
    P2 <-->|Read Movie Data| D2

    %% 3.0 Payment Processing
    User -->|Init Payment| P3
    P3 -->|Payment Status| User
    P3 -->|Transaction Info| PG
    PG -->|Success/Fail Status| P3
    P3 -->|Update Premium Status| D1

    %% 4.0 Admin Management
    Admin -->|Add/Edit/Delete Movies, Manage Users| P4
    P4 -->|Admin Stats| Admin
    P4 <-->|Modify Movies Data| D2
    P4 <-->|Read/Delete User Data| D1
```

---

## Level 2 DFD (Admin Management Process)
The Level 2 DFD provides a deeper dive into the Admin Management process, breaking it down into specific admin capabilities.

```mermaid
flowchart LR
    %% Entities
    Admin[Admin]

    %% Sub-processes
    P41((4.1 Manage Movies))
    P42((4.2 Manage Users))
    P43((4.3 View System Stats))

    %% Data Stores
    D1[(D1: Users DB)]
    D2[(D2: Movies DB)]

    %% 4.1 Manage Movies
    Admin -->|Movie Details (Title, Trailer, Genre)| P41
    P41 <-->|Insert/Update/Delete Movie| D2
    P41 -->|Movie Update Success| Admin

    %% 4.2 Manage Users
    Admin -->|Delete User Request| P42
    P42 <-->|Remove User| D1
    P42 -->|User Removal Confirmation| Admin

    %% 4.3 View System Stats
    Admin -->|Request Stats| P43
    D1 -->|User Count| P43
    D2 -->|Movie Count| P43
    P43 -->|Dashboard Analytics| Admin
```
