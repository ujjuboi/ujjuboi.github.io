# Side Projects & Building for Fun

**Date:** December 14, 2025

**Excerpt:** Why I build side projects, the tools I love, and a technical deep dive into building a CLI movie ticket booking system in C++ and other solo projects.

**Banner:** ../../Images/Graphics/Movie.svg

**Category:** Personal Projects

There's a special kind of creativity that comes from building things simply because you want to. While my day job at Deloitte keeps me busy with enterprise-scale identity governance platforms and real-time sensor dashboards, my side projects are where I explore fundamentals, experiment with different languages, and push my learning boundaries.

One of the most intense solo projects I've built was a CLI movie ticket booking system in C++. The goal wasn't just to build something fun — it was to deeply understand OOP principles in a systems language. I implemented the three pillars of OOP: encapsulation through private member access and public interfaces for movie, hall, and ticket classes; inheritance with a base Booking class and specialized subclasses for VIP, Regular, and Premium tiers; and abstraction where each component exposes only the necessary methods while hiding internal state.

The system handles a full booking workflow: users browse a menu to select movies, choose showtimes across multiple halls, and pick specific seats from a dynamically generated seat map. Each hall's seat layout was generated through a function that could be parameterized for different configurations. Customer data — name, mobile number, email — goes through input validation with regex checks; the system rejects invalid mobile numbers and malformed emails, re-entering until valid input is provided.

Persistence was handled through C++ file I/O. Each successful booking generated a unique user_id using the built-in rand() function, and customer data was appended to a text file — no database, just raw file handles and stream formatting. This taught me a great deal about data serialization, formatting guards, and handling edge cases like duplicate entries or partial writes. The booking flow also included a payment simulation that validated UPI IDs by checking for the @ symbol, mirroring real payment workflows.

Beyond the CLI project, I've built a real-time sensor dashboard using MQTT and WebSockets for IoT data streaming, a personal task automation tool using GitHub Actions templates, and a silly but fun tool that analyzes my reading and music habits to generate personalized recommendations using basic clustering. The stack matters less than shipping — I default to Next.js for web frontends, Express or FastAPI for APIs, and SQLite or MongoDB when I actually need persistence. But sometimes the best learning happens in a single .cpp file with no frameworks at all.

If you're a developer who hasn't started a side project yet, I'd encourage you to. The skills you develop — self-direction, rapid prototyping, and the courage to ship imperfect work — translate directly to your professional life in ways you wouldn't expect. And even if the project never goes anywhere, the technical muscles you flex along the way will serve you when the next enterprise challenge comes knocking.
