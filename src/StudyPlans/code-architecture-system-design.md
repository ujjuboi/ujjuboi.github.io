# Study Plan: Code Architecture & System Design

## Phase 1: Foundations — Domain Modeling & Scaling Basics

### Week 1: Domain Modeling & Capacity Estimation

- [ ] Domain Modeling — ubiquitous language, domain events, mapping domain to code
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Bounded contexts and context mapping
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Scaling from zero to millions — the 6 dimensions of scaling
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Back-of-the-envelope estimation — request rates, storage, bandwidth calculations
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Load estimation — RPS, latency targets, throughput, capacity planning
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Workload analysis — read-heavy, write-heavy, compute-intensive
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Design a URL shortener — requirements, capacity estimation, API design
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
  - Site: [System Design Questions (Arpit B Bhayani)](https://github.com/arpitbbhayani/system-design-questions)
- [ ] Design a key-value store — requirements, data model, scaling strategy
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu

### Week 2: Persistent Storage — Repository & Unit of Work

- [ ] Repository Pattern — abstraction over data access, separation of persistence logic
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Unit of Work Pattern — transaction management, saving invariants, identity map
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Aggregate Roots and Consistency Boundaries
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Data modeling for scale — relational vs document vs columnar stores
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Key-value stores — Redis, DynamoDB, storage engines, TTL, replication
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Relational databases for scale — partitioning, sharding, read replicas
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Storage design interview question — Google Drive file storage
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Implement a Repository pattern in Python with SQLAlchemy
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory

### Week 3: Coupling, Abstractions & Consistent Hashing

- [ ] Coupling and Abstractions — high cohesion, loose coupling, dependency inversion
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Dependency Injection and Bootstrapping — container, wiring, configuration
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Microservices — when to split, when not to, service boundaries
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Scaling basics — vertical vs horizontal, stateless services, session management
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Consistent Hashing — hash ring, virtual nodes, handling churn
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Caching fundamentals — CDN, in-memory cache, cache-aside, write-through
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Load balancing — L4 vs L7, round-robin, least connections, sticky sessions
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Design a web crawler — URL frontier, deduplication, politeness, distributed crawling
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu

## Phase 2: Architecture at Scale — APIs, Testing & Frameworks

### Week 4: Service Layers & API Design

- [ ] Service Layer Pattern — orchestrating use cases, transaction coordination
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Flask API design — routing, request/response lifecycle, middleware
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] RESTful API design — resource modeling, HTTP semantics, pagination, filtering
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] gRPC and protobuf — when to use RPC vs REST, streaming, service discovery
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] API versioning and backward compatibility
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] News Feed System — fan-out on write vs fan-out on read, hybrid approaches
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Chat System — real-time messaging, WebSocket architecture, presence, offline delivery
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Build a service layer with Flask that coordinates Repository and Unit of Work

### Week 5: TDD & System Design Framework

- [ ] TDD in High Gear — fast, isolated unit tests, test doubles, assertions
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] TDD in Low Gear — integration tests, database fixtures, contract tests
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Testing infrastructure — mocking external services, test containers, CI pipelines
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] System Design Interview Framework — clarification, estimation, interface design, deep dive
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] System Design fundamentals — CAP theorem, consistency models, failover strategies
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Distributed caching — Redis clustering, Memcached, invalidation strategies
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Design a search autocomplete system — trie structures, prefix search, latency optimization
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Write integration tests for a Flask service with database and external API calls

### Week 6: Microservices & Distributed Messaging Foundations

- [ ] Events and the Message Bus — pub/sub pattern, event routing, subscriber management
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Going to Town on the Message Bus — RabbitMQ, message acknowledgment, dead letter queues
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Commands and Command Handlers — CQS, command validation, idempotent handlers
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Message queues in distributed systems — Kafka, RabbitMQ, SQS
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Design a notification system — multi-channel (email, push, SMS), delivery guarantees, queuing
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Design YouTube — video ingest, transcoding pipeline, CDN distribution, streaming
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Build a simple message bus in Python with RabbitMQ and pub/sub subscribers

## Phase 3: Advanced Patterns — Events, CQRS & End-to-End System Design

### Week 7: Event-Driven Architecture

- [ ] Event-Driven Architecture — using events to integrate microservices, event sourcing basics
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Event Sourcing — command log, snapshots, projections, replay semantics
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Saga Pattern — choreography vs orchestration, compensating transactions
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Event streaming at scale — Kafka architecture, partitioning, consumer groups, replay
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] YouTube deep dive — content delivery network architecture, adaptive bitrate streaming
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Google Drive deep dive — file sync, conflict resolution, delta sync, storage deduplication
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Design a distributed task scheduler — job queues, retry logic, distributed locking
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu

### Week 8: CQRS & Read/Write Separation at Scale

- [ ] Command-Query Responsibility Segregation (CQRS) — separating read and write models
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Query-side patterns — denormalization, materialized views, search index sync
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Eventual consistency — caveats, anti-patterns, handling stale reads
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Database replication strategies — synchronous vs asynchronous, replication lag
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Search architecture — Elasticsearch, full-text search, faceting, ranking
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Graph databases and social feeds — relationship queries, graph traversals
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Design a social media news feed — ranking algorithms, personalization, feed generation
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu

### Week 9: End-to-End System Design

- [ ] End-to-end system design — taking a problem statement from requirements to architecture
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Requirements clarification — functional vs non-functional, constraints, edge cases
- [ ] Capacity estimation from requirements — traffic estimation, storage sizing, bandwidth
- [ ] High-level design — component diagram, data flow, service boundaries
- [ ] Deep dive on data model — schema design, indexing strategy, partitioning
- [ ] Deep dive on scalability — horizontal scaling, caching strategy, load balancing
- [ ] Trade-off analysis — consistency vs availability, latency vs throughput, cost vs performance
- [ ] System Design Interview Questions repo — practice questions on distributed systems, scalability
  - Site: [System Design Questions (Arpit B Bhayani)](https://github.com/arpitbbhayani/system-design-questions)
- [ ] Mock interview: Design a URL shortener (full lifecycle from requirements to architecture)
- [ ] Mock interview: Design a chat system with real-time messaging and history
- [ ] Mock interview: Design a video streaming platform like YouTube

## Phase 4: Hands-On Projects

### Project 1: Domain-Driven Blogging Platform

- [ ] Model the blogging domain — Post, Author, Comment, Tag aggregates with domain events
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Implement Repository Pattern for Post and Comment persistence
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Implement Unit of Work for transactional CRUD operations
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Build a Flask API service layer with CRUD endpoints and pagination
- [ ] Add caching layer for post listings (cache-aside pattern)
- [ ] Write integration tests with real database using test containers
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Add Redis caching for hot posts and per-user feed segments

### Project 2: Distributed Key-Value Store

- [ ] Design and implement a distributed key-value store with replication
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Implement consistent hashing for node assignment and rebalancing
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Add support for TTL (time-to-live) on keys
- [ ] Implement leader-based replication with failover
- [ ] Build a load balancer for read/write traffic distribution
- [ ] Test with simulated high read/write workloads and measure latency
  - Site: [System Design Questions (Arpit B Bhayani)](https://github.com/arpitbbhayani/system-design-questions)
- [ ] Implement distributed caching layer with cache-aside and write-through strategies

### Project 3: Event-Driven Notification Service

- [ ] Design the event model — UserRegistered, PaymentCompleted, OrderShipped domain events
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Implement a message bus with RabbitMQ for event routing
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Build command handlers for user-triggered actions (send, schedule, cancel notifications)
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Implement multi-channel delivery — email, push notifications, SMS with retry logic
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Add dead letter queue for failed deliveries and monitoring dashboards
- [ ] Implement Idempotent notification handlers to prevent duplicates
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Design a Saga pattern for order completion → notifications → audit logging

### Project 4: Image Service & Video Pipeline with CQRS

- [ ] Design separate read and write models — upload pipeline vs image gallery queries
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Implement CQRS — write side with Unit of Work, read side with denormalized view models
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Build an image/video upload service with CDN distribution
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu
- [ ] Implement video transcoding pipeline with multiple quality levels
- [ ] Build a search index using Elasticsearch for image metadata and tags
- [ ] Implement event-driven sync between write model and read projections
  - Book: "Architecture Patterns with Python" by Harry Percival & Bob Gregory
- [ ] Add adaptive bitrate streaming for video playback
  - Book: "System Design Interview – An Insider's Guide" by Alex Xu

## Weekly Schedule Suggestion

- 3 hours theory per week
- 2 hours hands-on coding per week
- 1 hour review/notes per week
- Weekend: 1 project milestone or challenge
