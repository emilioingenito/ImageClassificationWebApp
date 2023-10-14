# Image Classification Web Application

## Application Functionality
Our application's primary function is to enable users to upload images, which are then classified using a third-party API. These classified images are placed into separate buckets based on their categories. When users access a specific bucket, they can perform three main actions:

1. Rate images.
2. View images sorted by their ratings.
3. For users who are not logged in, they can only browse the buckets and view ranked images. However, logged-in users have the additional capabilities to rate and engage in chat discussions.

## Security and Privacy Concerns
Key security and privacy considerations include:

* Preventing non-logged-in users from chatting and rating images.
* Ensuring that user information remains private and not accessible to other users.
* Protecting against cross-site request forgery (CSRF) to prevent unauthorized posts or actions with other users' identities.
* Implementing content filtering mechanisms to prevent users from uploading or posting inappropriate content, potentially utilizing third-party APIs like SafeSearch.

## Architecture Building Blocks
The architecture is built upon the following fundamental components:

* Database: Used for storing bucket information, images, and user data, ensuring data persistence and retrieval.
* Front-End Application: This component is responsible for local bucket storage and user interaction with the application.
* Back-End Application: Handles critical functionalities such as user authentication, image uploading, and bucket selection.

## TechStack
For an in-depth view of our tech stack, please refer to our [TechStack Diagram](/documentation/diagram_mvp.jpg).
