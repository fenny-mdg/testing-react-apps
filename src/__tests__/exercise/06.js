// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import {build, fake} from '@jackfranklin/test-data-bot'
import {useCurrentPosition} from 'react-use-geolocation'
import Location from '../../examples/location'

jest.mock('react-use-geolocation')

test('displays the users current location', async () => {
  const fakePositionBuilder = build({
    fields: {
      coords: {
        latitude: fake(f => f.address.latitude()),
        longitude: fake(f => f.address.longitude()),
      },
    },
  })
  const fakePosition = fakePositionBuilder()
  let setReturnValue
  function useMockImplementation() {
    const [state, setState] = React.useState([])

    setReturnValue = setState

    return state
  }

  useCurrentPosition.mockImplementation(useMockImplementation)

  render(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => setReturnValue([fakePosition]))

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  expect(
    screen
      .getByText(/latitude/i)
      .textContent.includes(fakePosition.coords.latitude),
  ).toBe(true)
  expect(
    screen
      .getByText(/longitude/i)
      .textContent.includes(fakePosition.coords.longitude),
  ).toBe(true)

  //
  // If you'd like, learn about what this means and see if you can figure out
  // how to make the warning go away (tip, you'll need to use async act)
  // 📜 https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
  //
  // 🐨 verify the loading spinner is no longer in the document
  //    (💰 use queryByLabelText instead of getByLabelText)
  // 🐨 verify the latitude and longitude appear correctly
})

/*
eslint
  no-unused-vars: "off",
*/
