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

# Back again
## What I've done
- Created new convex query `getAvailableBudgets`
- Remade the dialog component as sheets
- Broke the styling on desktop view, good job, but don't fix it yet.
- Implemented the `getAvailableBudget` query. Strategy:
  - Prefetch once when user opens a form
- Shit I found better alternative to sheet component called drawer. But let's implement the combobox first then we can change it again into drawer component
- Installed `command`, `popover`, `drawer` component from shadcn

## Todos for tomorrow:
- Learn how to make good autofill combobox here: https://ui.shadcn.com/docs/components/combobox
- Change the `sheet` component with `drawer`
- Work on `/budgets` page


# Back again for the 3rd time
- Created the combobox using popover component
- Changed the sheet component with drawer component
- Created another state to maintain the combobox
  - when clear button is pressed, clears the state too
  - when submit button is pressed, clears the state too
- I also made sure that the component works fine

### Working on budgets page
- [x] Create convex function to create new budgets, accepting: `budget name` and `budget amount`
  - [x] modify convex schema to store additional things:
    - budget name
    - budget amount
  - [x] calculate `used amount` on the fly, don't store inside db, I think it's a better approach so we don't get race condition when writing new trx too fast
  - [x] calculate `progress bar` on the fly too.
- [x] Set budget page layout to grid with 2 cols
  - [x] 2 cols for summary (Total budgeted, total used, remaining, budget health (high amount = bad health))

- [x] Remove dummy data
- [x] Set loading state, error state, null state, happy state

# Back again for the 4th time
- Fixed migration script where categoryId is still unset