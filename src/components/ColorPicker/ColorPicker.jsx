import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import * as colors from '@mui/material/colors';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import Slider from '@mui/material/Slider';
import Popover from '@mui/material/Popover';

const defaults = {
  primary: '#2196f3',
  // secondary: '#f50057',
};
const hues = [
  'red',
  'pink',
  'purple',
  'deepPurple',
  'indigo',
  'blue',
  'lightBlue',
  'cyan',
  'teal',
  'green',
  'lightGreen',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deepOrange',
];

const shades = [
  900,
  800,
  700,
  600,
  500,
  400,
  300,
  200,
  100,
  50,
  'A700',
  'A400',
  'A200',
  'A100',
];

/**
 * This component is based off of this one from MUI:
 * https://github.com/mui/material-ui/blob/master/docs/data/material/customization/color/ColorTool.js
 */
export default function ColorPicker(props) {
  const theme = useTheme();
  const [colorState, setColorState] = useState({
    primary: defaults.primary,
    // secondary: defaults.secondary,
    primaryInput: defaults.primary,
    // secondaryInput: defaults.secondary,
    primaryHue: 'blue',
    // secondaryHue: 'pink',
    primaryShade: 4,
    // secondaryShade: 11,
  });

  // eslint-disable-next-line no-unused-vars
  const { primary, primaryInput, primaryHue, primaryShade } = colorState
  const { open, onClose, id, anchorEl, dispatchFunction } = props

  // eslint-disable-next-line no-unused-vars
  const background = theme.palette.augmentColor({
    color: {
      main: primary,
    },
  });

  const handleChangeColor = (event) => {
    const isRgb = (string) =>
      /rgb\([0-9]{1,3}\s*,\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\)/i.test(string);

    const isHex = (string) => /^#?([0-9a-f]{3})$|^#?([0-9a-f]){6}$/i.test(string);

    let {
      target: { value: color },
    } = event;

    setColorState((prevState) => ({
      ...prevState,
      primaryInput: color,
    }));

    let isValidColor = false;

    if (isRgb(color)) {
      isValidColor = true;
    } else if (isHex(color)) {
      isValidColor = true;
      if (color.indexOf('#') === -1) {
        color = `#${color}`;
      }
    }

    if (isValidColor) {
      setColorState((prevState) => ({
        ...prevState,
        primary: color,
      }));
      dispatchFunction(color);
    }
  };

  const handleChangeHue = (event) => {
    const hue = event.target.value;
    const color = colors[hue][shades[colorState['primaryShade']]];

    setColorState({
      ...colorState,
      primaryHue: hue,
      primary: color,
      primaryInput: color,
    });
    dispatchFunction(color);
  };

  const handleChangeShade = (event, shade) => {
    const color = colors[colorState.primaryHue][shades[shade]];
    setColorState({
      ...colorState,
      primaryShade: shade,
      primary: color,
      primaryInput: color,
    });
    dispatchFunction(color);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Grid item xs={12} sm={6} md={4} p={4}>
        <Typography
          component="label"
          gutterBottom variant="h6"
        >
          Choose a Color
        </Typography>
        <Input
          id={'primary'}
          value={primaryInput}
          onChange={handleChangeColor}
          fullWidth
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
          <Typography
            id={'primaryShadeSliderLabel'}
            // style={{
            //   color: theme.palette.getContrastText(background.main),
            // }}
          >
            Shade:
          </Typography>
          <Slider
            sx={{ width: 'calc(100% - 80px)', ml: 3, mr: 3 }}
            value={primaryShade}
            min={0}
            max={13}
            step={1}
            onChange={handleChangeShade}
            aria-labelledby={'primaryShadeSliderLabel'}
          />
          <Typography>{shades[primaryShade]}</Typography>
        </Box>
        <Box sx={{ width: 192 }}>
        {hues.map((hue) => {
          const shade = shades[colorState.primaryShade]
          const backgroundColor = colors[hue][shade];
          return (
            <Radio
              sx={{ p: 0 }}
              color="default"
              checked={colorState['primary'] === backgroundColor}
              onChange={handleChangeHue}
              value={hue}
              key={hue}
              name={'primary'}
              icon={
                <Box
                  sx={{ width: 48, height: 48 }}
                  style={{ backgroundColor }}
                />
              }
              checkedIcon={
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    border: 1,
                    borderColor: 'white',
                    color: 'common.white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  style={{ backgroundColor }}
                >
                  <CheckIcon style={{ fontSize: 30 }} />
                </Box>
              }
            />
          );
        })}
        </Box>
      </Grid>
    </Popover>
  )
};
