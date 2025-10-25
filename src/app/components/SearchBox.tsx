import { Dispatch, RefObject, SetStateAction,} from 'react'
import { Autocomplete,
    ThemeProvider,
    TextField,
    InputAdornment,
    alpha
 } from '@mui/material'
import { Search } from '@mui/icons-material'
import theme from './theme'

interface SearchBoxProp {
    label? : string;
    data? : Array<any>;
    title? : RefObject<string>;
    setTitle?: Dispatch<SetStateAction<string>>;
}

function SearchBox(
   { label = "Search",
    data = [],
    title, setTitle
    } : SearchBoxProp
) {

    const handleInputChange = (event) => {
        // title.current = event.target.textContent
        setTitle(event.target.textContent)
        // console.log(event.target.textContent)
    }

    const handleOnChange = (event) => {
        // title.current = event.target.value
        setTitle(event.target.value)
    }

  return (
    <ThemeProvider theme={theme}>
        <Autocomplete
            sx={{ width: 1/2, position:"fixed", top:0, marginTop:5, left:"25%", zIndex:1000,}}
            freeSolo
            id="free-solo-2-demo"
            onInputChange={handleInputChange}
            // disableClearable
            options={data.map((option) => option.Title)}
            renderInput={(params) => (
            <TextField
                {...params}
                label={label}
                variant="filled"
                onChange={handleOnChange}
                slotProps={{
                input: {
                    ...params.InputProps,
                    type: 'search',
                    startAdornment: (
                        <InputAdornment position="end">
                            <Search />
                        </InputAdornment>
                    )
                }
                }}
                sx={{
                    '& .MuiFilledInput-root': {
                    overflow: 'hidden',
                    borderRadius: 4,
                    border: '1px solid',
                    backgroundColor: '#F3F6F9',
                    borderColor: '#E0E3E7',
                    transition: theme.transitions.create([
                    'border-color',
                    'background-color',
                    'box-shadow',
                    ]),
                    '&:hover': {
                        backgroundColor: "white",
                    },
                    '&.Mui-focused': {
                    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
                    borderColor: theme.palette.primary.main,
                    },
                    ...theme.applyStyles('dark', {
                    backgroundColor: '#1A2027',
                    borderColor: '#2D3843',
                    }),
                
                },
                }}
            />
            )}
            />
    </ThemeProvider>
  )
}

export default SearchBox