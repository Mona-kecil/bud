# Idea
I want to work on budgets next. If this part is done, `category` section on creating transactions part will be type-safe. No more loosely typed categories.

## Todos
So, if I comeback later to this repo, here's what I should do:
- [ ] Create Convex schema for the budgets table
- [ ] Create the query/mutation fn
  - [ ] Query fn: If user focus on `category` input, show a dropdown with lists of budget name they've created before.
  - [ ] Mutation fn: If user created a new budget on `/budgets` page, store it.

## Things to consider
- What if the user directly go to `/transactions` without creating a budget first? (maybe show a quick modal where they can create budgets on the fly)
- What if the budget is close to 100%? Should we give notification?
- How to make budget creation process as seamless as possible? Since we force the user to create a budget first before tracking any transactions.
- I'm the only user, so I should be able to answer all of these.

# I'm back
## What I've done (development environment)
- Created new schema called `budgets` with field: userId, and name
- Added new optional field in `transactions` called `categoryId` that linked to category table
- `npx convex dev` to update the schema
- created new `migrate.ts` file to write migration script
  - format `SOME CaTegORY` to `Some Category` (extracted to helper fn)
  - idempotent by design
- `npx convex dev` to sync the functions to convex dashboard
- ran the function from the dashboard
  - `budgets` table filled successfully, I like the format too.

## Todos for tomorrow morning:
- Connect it with transactions table
- Create some sort of autocomplete, a dropdown menu? filled with user's budget
- Restrict user from using categories they haven't created the budget for
- I think should add one default category `others` so user can still create trx without getting blocked by this strict feature.
- after migration complete and I like the flow:
  - remove old column
  - remove optional flag from new column