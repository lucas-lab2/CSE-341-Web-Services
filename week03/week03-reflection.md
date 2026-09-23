# Week 03 Reflection

## Selected Feature Set

1. Which feature set were you assigned to complete?

Answer: As a solo developer, I was responsible for all five feature sets: **Feature Set 1 (Trips)**, **Feature Set 2 (Schedules)**, **Feature Set 3 (Bookings)**, **Feature Set 4 (Ticket Classes)**, and **Feature Set 5 (Stations)**. The instructor-provided Trains example served as the canonical pattern for my implementation. All five sets are implemented in a single repository (`week03/`) following the Mongoose schema → model → controller → route architecture.

---

## Links

2. Provide your walk-through video link. This video must demonstrate your feature working locally and follow the script in the assignment. (If you created more than one video for your feature set, include them all here.)

Video link: https://youtu.be/faFL1D475vM

3. Provide links to all GitHub Issues you created for your selected feature set.

Issue links:
- https://github.com/lucas-lab2/CSE-341-Web-Services/issues/7

4. Provide links to all Pull Requests you created for your selected feature set.

Pull request links:
- https://github.com/lucas-lab2/CSE-341-Web-Services/pull/8

---

## Implementation Reflection

5. Why did you decide to split your Feature Set into multiple GitHub issues or use a single issue?

Answer: I chose to use **a single GitHub issue** for all five feature sets. The deciding factor was the tight **dependency chain** between the files: every schema must exist before its model can be written, every model before its controller, and every controller before it can be wired into the route file. Breaking these into separate issues would have required careful sequencing of branches and merges, adding coordination overhead that makes no sense for a solo workflow. A single, detailed issue with a clear acceptance checklist gave me a structured spec to work against while keeping the branch history clean. In a real team, each feature set would likely be its own issue so teammates could work in parallel — but the sequential dependency between schema, model, controller, and route layers would still need to be acknowledged in the issue descriptions.

6. What is one thing you know after completing the assignment that you did not know beforehand?

Answer: I learned the concrete difference between Mongoose's `{ new: true }` and `runValidators: true` options on `findByIdAndUpdate()`. Before this assignment I knew Mongoose had update options, but I didn't understand that by default Mongoose skips schema validation on updates — meaning a document that passes `create()` validation could receive invalid data later through an update without any error being thrown. Adding `runValidators: true` closes that gap and makes the API behave consistently. I also learned why the `unique` schema option alone is not sufficient for required fields, and why duplicate-key errors (code 11000) should be mapped explicitly to `409 Conflict` rather than a generic `500`.

7. What did you do to make your pull requests clear and ready for teammate review?

Answer: I prepared the pull request by doing four things: (1) I wrote a detailed PR description that maps each changed file to its purpose, so a reviewer can understand the scope without opening every file. (2) I included a numbered test plan with the exact HTTP method, URL, and expected status code for each test I ran, so a reviewer can reproduce my checks. (3) I added an explicit "Key Technical Decision" section explaining why I chose to embed the Passenger sub-document inside Booking rather than using a reference — giving the reviewer the reasoning behind a non-obvious design choice. (4) I made sure the PR description references the GitHub issue with "Closes #[ISSUE-NUMBER]" so GitHub automatically links the two and closes the issue on merge.

---

## Team Process

8. What is one thing you can do personally to help your team be more effective next week?

Answer: Next week I will write more granular GitHub issues — separating schema/model work from controller/route work — and complete them in smaller, reviewable pull requests. This week, wrapping all five feature sets into one branch and one PR was manageable alone, but in a real team it would mean teammates have to review hundreds of lines of changes at once, which slows review cycles and increases the chance of missed bugs. Smaller, focused PRs are easier to review, easier to revert if something breaks, and faster to merge. I will also make a habit of running the ESLint check before opening any PR and including that result in the PR description.
