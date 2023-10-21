import React from 'react'
import { Link, Box, Typography, Menu, MenuItem, AppBar, Divider, useMediaQuery, Drawer, List, ListItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LoginContext } from '../context/Context';
import MenuIcon from '@mui/icons-material/Menu';

function Content() {

    const { user } = React.useContext(LoginContext)

    const [open, setOpen] = React.useState<boolean>(false)
    function handleClick() {
        setOpen(!open);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const anchorEl = document.getElementById('basic-button')

    function handleLogout() {
        localStorage.removeItem('user')
        handleClose()
        window.location.href = '/'
    }

    return (
        <>
            <AppBar position="relative" sx={{ backgroundColor: 'white', color: '#000000' }}>
                <div className='w-11/12 mx-auto py-3'>
                    <div className='flex justify-between items-center'>
                        <Box
                            className="flex items-center justify-start w-[60%] md:w-[50%] "
                        >
                            <img src={require('../assets/logo-1.png')} style={{ width: '80px' }} alt="Roambingo" />
                            <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#312f92' }}>Roam</Typography>
                            <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#fc3532' }}>Bingo</Typography>

                        </Box>
                        <Box
                            className="flex items-center justify-start md:w-full mx-4"
                        >
                            <NavLink to="/home" className="duration-150 hover:scale-105"  style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: '0 1rem' }}>Home</NavLink>
                            <NavLink to="/about" className="duration-150 hover:scale-105" style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: '0 1rem' }}>About</NavLink>
                            <NavLink to="/contact" className="duration-150 hover:scale-105"  style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: '0 1rem' }}>Contact</NavLink>
                        </Box>
                        <Box
                            className="flex items-center justify-end md:w-full "
                        >
                            <p style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: '0 1rem' }}>Total Points - {user.total_point}</p>
                            <Divider orientation="vertical" flexItem />
                            <p style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: '0 1rem' }}>Hello, {user.name ? user.name : user.username}</p>
                            <Divider orientation="vertical" flexItem />
                            <div className='flex justify-start items-center ml-2  cursor-pointer'
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                id="basic-button"
                            >
                                {
                                    user.profile_image === null ?
                                        <AccountCircleIcon sx={{ color: '#000000', fontSize: '40px', fontWeight: '600', }} />
                                        :
                                        <img src={user.profile_image} alt={user.username} className='w-[40px] h-[40px] rounded-[50%]' />
                                }
                                <ArrowDropDownIcon sx={{ color: '#000000', fontSize: '20px', fontWeight: '600', }} />
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose}><NavLink to="/profile">My Profile</NavLink> </MenuItem>
                                    <MenuItem onClick={handleClose}><NavLink to="/points">My Points</NavLink> </MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </div>

                        </Box>
                    </div>
                </div>
            </AppBar>
        </>
    )
}


function SMContent() {

    const { user } = React.useContext(LoginContext)
    const [open, setOpen] = React.useState<boolean>(false)

    const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setOpen(!open)
    };

    function handleLogout() {
        localStorage.removeItem('user')
        setOpen(!open)
        window.location.href = '/'
    }

    return (
        <>
            <AppBar position="relative" sx={{ backgroundColor: 'white', color: '#000000' }}>
                <div className='w-11/12 mx-auto py-3'>
                    <div className='flex justify-between items-center'>
                        <Box
                            className="flex items-center justify-start w-[60%] md:w-[50%] "
                        >
                            <img src={require('../assets/logo-1.png')} style={{ width: '80px' }} alt="Roambingo" />
                            <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#312f92' }}>Roam</Typography>
                            <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#fc3532' }}>Bingo</Typography>

                        </Box>
                        <MenuIcon className='text-[25px] cursor-pointer' onClick={toggleDrawer} />
                    </div>
                </div>
            </AppBar>
            <Drawer
                open={open}
                onClose={toggleDrawer}
            >
                <Box
                    className="flex items-center justify-start mx-3 mr-[5rem] my-4"
                >
                    <img src={require('../assets/logo-1.png')} style={{ width: '80px' }} alt="Roambingo" />
                    <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#312f92' }}>Roam</Typography>
                    <Typography variant="h6" sx={{ fontSize: '24px', fontWeight: '600', color: '#fc3532' }}>Bingo</Typography>

                </Box>
                <Divider />
                <div>
                    <List sx={{ p: 0 }}>
                        <ListItem button>
                            <Link className="duration-150 hover:scale-105 py-2" href="/home" underline="none" sx={{ color: '#000000', fontSize: '16px', fontWeight: '600', mx: '1rem' }}>Home</Link>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <Link className="duration-150 hover:scale-105 py-2" href="/about" underline="none" sx={{ color: '#000000', fontSize: '16px', fontWeight: '600', mx: '1rem' }}>About</Link>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <Link className="duration-150 hover:scale-105 py-2" href="/contact" underline="none" sx={{ color: '#000000', fontSize: '16px', fontWeight: '600', mx: '1rem' }}>Contact</Link>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <p style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: '0 1rem' }}>Total Points - {user.total_point}</p>
                        </ListItem>
                        <Divider />

                        <ListItem button className='flex justify-start items-center'>
                            <p style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: '0 1rem' }}>Hello, {user.name ? user.name : user.username}</p>
                            {
                                user.profile_image === null ?
                                    <AccountCircleIcon sx={{ color: '#000000', fontSize: '40px', fontWeight: '600', }} />
                                    :
                                    <img src={user.profile_image} alt={user.username} className='w-[40px] h-[40px] rounded-[50%]' />
                            }
                        </ListItem>
                        <Divider />

                        <ListItem button>
                            <Link className="duration-150 hover:scale-105 py-2" href="/profile" underline="none" sx={{ color: '#000000', fontSize: '16px', fontWeight: '600', mx: '1rem' }}>My Profile</Link>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <Link className="duration-150 hover:scale-105 py-2" href="/points" underline="none" sx={{ color: '#000000', fontSize: '16px', fontWeight: '600', mx: '1rem' }}>My Points</Link>
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <p className="duration-150 hover:scale-105 py-2" onClick={handleLogout} style={{ color: '#000000', fontSize: '16px', fontWeight: '600', margin: 'auto 1rem' }}>Logout</p>
                        </ListItem>

                    </List>
                </div>
            </Drawer>
        </>
    )
}

export default function Header() {

    const xlMin = useMediaQuery('(min-width:1110px)');
    const sm = useMediaQuery('(max-width:1110px)');

    return (
        <>
            {xlMin && (
                <Content />
            )}
            {sm && (
                <SMContent />
            )}
        </>
    )
}