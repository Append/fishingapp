# CYBR8480_Project - FishBright

## Executive Summary
Fishing is an activity that humans have worked at improving since prehistory.  What began as a way to survive has become a passtime that reconnects us to our primitive roots.  But fishing need not stay primitive in how we approach it.  The fishing analytics product, FishBright, will allow for modern analysis of weather and other environmental factors; and how they directly contribute to catching more fish.  Statistical analysis of fishing will provide users with a better understanding of what causes fish to bite non-stop one day and to become uncatchable the next.  FishBright will help anglers decide what bait presentations will work any given day based on more than experience or guesswork.  While the average fisher who wants an edge in their passtime will be greatly helped by this product, the main user base that this product targets is people who make a living fishing, as guides or as professional anglers.  

### Objectives
1. Building an app that is able to collect data from the phone itself and from other sensors
    - The hybrid app will help users by allowing the application to use the built in functionality of their modbile device and external sensors that create a bigger picture of data
2. Logging weather and environment data for analysis
    - Logging weather and environment data will help users understand the intracacies of what the fish are doing when the weather or pressure are a certain way
3. Allow users to record specific catch events in the app
    -  This feature will allow users to log catches and review them in the future for memories sake, or for improving their angling ability
4. Correlate specific catches to logged environment data
    -  This will allow users to be more concious of what environments produce better results with certain methods of fishing
5. Produce fishing analytics
    -  This piece of the project ties everything together to give the user a friendly and easy to read understanding of their fishing
6. Large data analytics
    -  By taking in data from all the users, the FishBright application will be able to see trends across all anglers and produce tips for the benefit of the whole 
    
### Gantt Chart
![alt text](https://github.com/Append/CYBR8480_Project/blob/master/pictures/Gantt.PNG "Gantt Chart")

### Risk List
|Risk name (value)  | Impact     | Likelihood | Description | Mitigation |
|-------------------|------------|------------|-------------|------------|
|Major Illness (20) | 10 | 2 | Major illness in project lead  | Try to make smart health choices |
|Water Destruction (45) | 9 | 5 | Destruction of components in water because of the nature of the project and its proximity to water | Look into waterproofing solutions, stress careful handling in testing|
|IR Sensor Failure (20) | 5 | 4 | IR Sensor in SensorTag found incapable of accurately monitoring water temperature  | Accept risk, and investigate alternatives for future|
|Phone GPS Inaccuracy (8) | 4 | 2 | The phone gps isn't accurate enough to work with the application analytics | Accept risk, build in future alternative options|
|Delay from documentation (40) | 5 | 8 | Delay in production because of missing, improper, or poor documentation for the Texas Instruments SensorTag | Investigate other documentation sources (i.e. other projects using SensorTag) |

### User Stories

* As a **Professional Bass Angler**, I want to **see my past catches on this lake** so I can **pick the best lure for this competition**.
* As a **Casual Angler**, I want to **check historic weather data** so I can **decide what and where to fish today**.
* As a **Fishing Guide**, I want to **see the current lake environment** so I can **pick the best place to fish for clients**.

### Misuser Stories

* As a **Evil Professional Angler**, I want to misuse **historic catch data of my competition** so I can **steal their lake knowledge**.
* As a **Competitor Guide**, I want to misuse **lake environment sensors** so I can **denial of service my competitors data to steal their customers**.

###Component Diagram
![alt text](https://github.com/Append/CYBR8480_Project/blob/master/pictures/cdiagram.PNG "Component Diagram")
