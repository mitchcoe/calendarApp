import Event from "./Event";
import type { EventType as EventItem, HandleClickType } from '../../globalTypes'
// import { css } from '@emotion/css'

/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react'

type EventsContainerProps = {
  events: EventItem[],
  handleClick: HandleClickType
}

export default function EventsContainer(props: EventsContainerProps) {
  const { events, handleClick } = props;
  const eventContainerStyles = { // going to adjust this later
    // position: 'absolute',
    // display: 'flex',
    // maxWidth: 'calc(100vw - 144px)',
    // width: '100vw',
    // transform: `translateY(-800px) translateX(96px)`,
    // paddingRight: '16px',
    // marginRight: '-16px',
    // zIndex: 900
  };
  return (
    <div css={eventContainerStyles} data-testid="event_container">
      {events.map((eventItem: EventItem, index) => (
        <Event
          key={eventItem.event_id}
          event={eventItem}
          zIndex={index}
          handleClick={handleClick}
          color={eventItem.color!}
        />
      ))}
    </div>
  )
};
