import Event from "./Event";
// import { css } from '@emotion/css'

/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@emotion/react'

type Event = {
  event_id: number,
  title: string,
  location: string,
  start_time: string,
  end_time: string,
  color: string,
}

type EventsContainerProps = {
  events: Event[],
  handleClick: (e: object, event: Event) => void
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
      {events.map((eventItem, index) => (
        <Event
          key={eventItem.event_id}
          event={eventItem}
          zIndex={index}
          handleClick={handleClick}
          color={eventItem.color}
        />
      ))}
    </div>
  )
};
