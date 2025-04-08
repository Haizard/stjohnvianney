import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import DirectLink from './common/DirectLink';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Tooltip,
  Collapse,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  Subject as SubjectIcon,
  AssignmentInd as AssignmentIndIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Announcement as AnnouncementIcon,
  Settings as SettingsIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  SupervisorAccount as SupervisorAccountIcon,
  PersonAdd as PersonAddIcon,
  LibraryBooks as LibraryBooksIcon,
  Logout as LogoutIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  ContentCopy as ContentCopyIcon,
  GroupWork as GroupWorkIcon,
  CalendarToday as CalendarTodayIcon,
  ImportExport as ImportExportIcon,
  Email as EmailIcon,
  Grade as GradeIcon,
  Sms as SmsIcon,
  ContactPhone as ContactPhoneIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/userSlice';
import RoleFixButton from './common/RoleFixButton';

const drawerWidth = 280;

const Navigation = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  // Use a single state to track which category is open
  const [openCategory, setOpenCategory] = useState('');

  // Group navigation items by category for admin and finance roles
  const getGroupedItems = (items) => {
    if (!user || (user.role !== 'admin' && user.role !== 'finance')) {
      return { ungrouped: items };
    }

    const grouped = {
      main: [],
      users: [],
      academics: [],
      assessment: [],
      communication: [],
      finance: [],
      system: []
    };

    items.forEach(item => {
      if (item.text === 'Dashboard') {
        grouped.main.push(item);
      } else if (['Teachers', 'User Management', 'Create User', 'Direct Student Register', 'Link Teacher Profiles', 'Debug User Role'].includes(item.text)) {
        grouped.users.push(item);
      } else if (['Classes', 'Subjects', 'Subject-Class Assignment', 'Teacher Assignments', 'Student Assignments'].includes(item.text)) {
        grouped.academics.push(item);
      } else if (['Results', 'Exams', 'Create Exams', 'Exam Types'].includes(item.text)) {
        grouped.assessment.push(item);
      } else if (['Parent Contacts', 'SMS Settings', 'News'].includes(item.text)) {
        grouped.communication.push(item);
      } else if (['Finance', 'Fee Structures', 'Fee Templates', 'Bulk Operations', 'Fee Schedules', 'Student Fees', 'Payments', 'Reports', 'Import/Export', 'QuickBooks'].includes(item.text)) {
        grouped.finance.push(item);
      } else {
        grouped.system.push(item);
      }
    });

    return grouped;
  };

  // Navigation items based on user role
  const getNavigationItems = (role) => {
    switch (role) {
      case 'admin':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
          { text: 'Teachers', icon: <PeopleIcon />, path: '/admin/teachers' },
          { text: 'Link Teacher Profiles', icon: <AssignmentIndIcon />, path: '/admin/link-teacher-profiles' },
          { text: 'User Management', icon: <SupervisorAccountIcon />, path: '/admin/users' },
          { text: 'Create User', icon: <PersonAddIcon />, path: '/admin/create-user' },
          { text: 'Direct Student Register', icon: <PersonAddIcon />, path: '/admin/direct-student-register' },
          { text: 'Debug User Role', icon: <SupervisorAccountIcon />, path: '/admin/debug-user-role' },
          { text: 'Classes', icon: <ClassIcon />, path: '/admin/classes' },
          { text: 'Subjects', icon: <SubjectIcon />, path: '/admin/subjects' },
          { text: 'Subject-Class Assignment', icon: <LibraryBooksIcon />, path: '/admin/subject-class-assignment' },
          { text: 'Teacher Assignments', icon: <AssignmentIcon />, path: '/admin/teacher-assignments' },
          { text: 'Student Assignments', icon: <AssignmentIcon />, path: '/admin/student-assignments' },
          { text: 'Results', icon: <AssessmentIcon />, path: '/admin/results' },
          { text: 'Exams', icon: <ScheduleIcon />, path: '/admin/exams' },
          { text: 'Create Exams', icon: <AssessmentIcon />, path: '/admin/exam-creation' },
          { text: 'Exam Types', icon: <AssessmentIcon />, path: '/admin/exam-types' },
          { text: 'Parent Contacts', icon: <ContactPhoneIcon />, path: '/admin/parent-contacts' },
          { text: 'SMS Settings', icon: <SmsIcon />, path: '/admin/sms-settings' },
          { text: 'Finance', icon: <AttachMoneyIcon />, path: '/finance' },
          { text: 'News', icon: <AnnouncementIcon />, path: '/admin/news' },
          { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
        ];
      case 'teacher':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/teacher' },
          { text: 'My Subjects & Classes', icon: <SubjectIcon />, path: '/teacher/my-subjects' },
          { text: 'Enter Marks', icon: <GradeIcon />, path: '/teacher/marks-entry' },
          { text: 'Results', icon: <AssessmentIcon />, path: '/teacher/results' },
          { text: 'Class Reports', icon: <DescriptionIcon />, path: '/teacher/class-reports' },
          { text: 'SMS Notification', icon: <SmsIcon />, path: '/teacher/sms-notification' },
          { text: 'Exams', icon: <ScheduleIcon />, path: '/teacher/exams' },
          { text: 'Students', icon: <PeopleIcon />, path: '/teacher/students' },
        ];
      case 'student':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/student' },
          { text: 'Profile', icon: <PersonIcon />, path: '/student/profile' },
          { text: 'Grades', icon: <AssessmentIcon />, path: '/student/grades' },
          { text: 'Exams', icon: <ScheduleIcon />, path: '/student/exams' },
          { text: 'Messages', icon: <EmailIcon />, path: '/student/messages' },
        ];
      case 'parent':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/parent' },
          { text: 'Results', icon: <AssessmentIcon />, path: '/parent/results' },
          { text: 'Academics', icon: <SchoolIcon />, path: '/parent/academics' },
          { text: 'News', icon: <AnnouncementIcon />, path: '/parent/news' },
          { text: 'Messages', icon: <EmailIcon />, path: '/parent/messages' },
        ];
      case 'finance':
        return [
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/finance' },
          { text: 'Fee Structures', icon: <LibraryBooksIcon />, path: '/finance/fee-structures' },
          { text: 'Fee Templates', icon: <ContentCopyIcon />, path: '/finance/fee-templates' },
          { text: 'Bulk Operations', icon: <GroupWorkIcon />, path: '/finance/bulk-fee-structures' },
          { text: 'Fee Schedules', icon: <CalendarTodayIcon />, path: '/finance/fee-schedules' },
          { text: 'Student Fees', icon: <PeopleIcon />, path: '/finance/student-fees' },
          { text: 'Payments', icon: <ReceiptIcon />, path: '/finance/payments' },
          { text: 'Reports', icon: <AssessmentIcon />, path: '/finance/reports' },
          { text: 'Import/Export', icon: <ImportExportIcon />, path: '/finance/import-export' },
          { text: 'QuickBooks', icon: <AccountBalanceIcon />, path: '/finance/quickbooks' },
          { text: 'Settings', icon: <SettingsIcon />, path: '/finance/settings' },
        ];
      default:
        return [];
    }
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navigationItems = getNavigationItems(user?.role);
  const groupedItems = getGroupedItems(navigationItems);

  // Reset category when component mounts
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // No category open by default
    setOpenCategory('');
    setActiveCategory('');
  }, []);

  // Set open category based on current path
  useEffect(() => {
    if (location.pathname) {
      const currentPath = location.pathname;

      // Find which category contains the current path
      for (const [category, items] of Object.entries(groupedItems)) {
        if (category !== 'main' && category !== 'ungrouped') {
          const found = items.find(item => currentPath === item.path);
          if (found) {
            // Open this category
            setOpenCategory(category);
            break;
          }
        }
      }
    }
  }, [location.pathname, groupedItems]);

  // Handle category click - toggle the specific category
  const handleCategoryClick = (category) => {
    console.log('Clicking category:', category, 'Current open:', openCategory);

    // Don't allow toggling main or ungrouped - they should always be open
    if (category === 'main' || category === 'ungrouped') {
      return;
    }

    // Force a complete reset if we detect we're stuck
    if (openCategory && openCategory !== category && openCategory !== 'main' && openCategory !== 'ungrouped') {
      console.log('Forcing reset due to potential stuck state');
      // First close everything
      setOpenCategory('');

      // Use setTimeout to ensure state update has completed before opening the new category
      setTimeout(() => {
        setOpenCategory(category);
      }, 50);
      return;
    }

    // Normal toggle behavior
    if (openCategory === category) {
      setOpenCategory('');
    } else {
      setOpenCategory(category);
    }
  };

  // Handle closing a category
  const handleCloseCategory = (e, category) => {
    // Stop event propagation to prevent the category from opening again
    e.stopPropagation();
    console.log('Explicitly closing category:', category);

    // Don't allow closing main or ungrouped - they should always be open
    if (category === 'main' || category === 'ungrouped') {
      return;
    }

    // Force close all categories
    setOpenCategory('');

    // Also reset active category for good measure
    setActiveCategory('');
  };

  // Get first letter of username for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const renderNavItems = (items) => {
    return items.map((item) => (
      <ListItem
        button
        key={item.text}
        component={item.path.startsWith('/finance') ? DirectLink : Link}
        to={item.path}
        selected={location.pathname === item.path}
        className="slide-in-left"
        sx={{
          borderRadius: '10px',
          mb: 0.5,
          py: 1.5, // Increased vertical padding for taller height
          transition: 'all 0.3s ease',
          backgroundColor: '#283593', // Lighter blue background for menu items
          '&:hover': {
            transform: 'translateX(5px)',
            backgroundColor: '#3949ab', // Even lighter blue on hover
          },
          '&.Mui-selected': {
            backgroundColor: '#3f51b5', // Highlight color for selected item
            borderLeft: '4px solid',
            borderColor: 'secondary.main',
            '&:hover': {
              backgroundColor: '#5c6bc0',
            },
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: '40px', color: 'white' }}>
          {item.text === 'Dashboard' ? (
            <Badge color="secondary" variant="dot" invisible={false}>
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{
            fontSize: { xs: '0.9rem', sm: '1rem' },
            fontWeight: location.pathname === item.path ? 600 : 400,
            color: '#ffffff'
          }}
        />
        {item.text === 'Results' && (
          <Chip
            label="New"
            size="small"
            color="secondary"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        )}
      </ListItem>
    ));
  };

  const renderCategorySection = (title, items, category) => {
    if (!items || items.length === 0) return null;

    return (
      <Box key={category} sx={{ mb: 1 }}>
        {title && (
          <Box
            onClick={() => handleCategoryClick(category)}
            sx={{
              px: 3,
              py: 1.5, // Increased vertical padding for taller height
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
              borderRadius: '8px',
              mx: 1,
              mb: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dark background for category headers
              borderLeft: '3px solid #ff9800', // Orange left border
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: '#ff9800', // Orange color for category titles
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}
            >
              {title}
            </Typography>
            {openCategory === category || category === 'main' || category === 'ungrouped' ? (
              <IconButton
                size="small"
                onClick={(e) => handleCloseCategory(e, category)}
                sx={{ color: '#ffffff', p: 0.5 }}
              >
                <ExpandLessIcon />
              </IconButton>
            ) : (
              <ExpandMoreIcon sx={{ color: '#ffffff' }} />
            )}
          </Box>
        )}
        <Collapse
          key={`collapse-${category}-${openCategory === category}`}
          in={openCategory === category || category === 'main' || category === 'ungrouped'}
          timeout="auto"
          unmountOnExit={true}
        >
          <List component="div" disablePadding>
            {renderNavItems(items)}
          </List>
        </Collapse>
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: 40,
            height: 40,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          {getInitial(user?.username)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
            {user?.username || 'AGAPE LUTHERAN'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Role'}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />

      <Box sx={{ flexGrow: 1, px: 1 }}>
        {/* Render grouped navigation items */}
        {user?.role === 'admin' || user?.role === 'finance' ? (
          <List>
            {/* Render all navigation items directly without categories */}
            {navigationItems.map((item, index) => (
              <ListItem
                key={`nav-item-${item.path}`}
                button
                component={item.path.startsWith('/finance') ? DirectLink : Link}
                to={item.path}
                selected={location.pathname === item.path}
                className="slide-in-left"
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  backgroundColor: '#283593',
                  '&:hover': {
                    transform: 'translateX(5px)',
                    backgroundColor: '#3949ab',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#3f51b5',
                    borderLeft: '4px solid',
                    borderColor: 'secondary.main',
                    '&:hover': {
                      backgroundColor: '#5c6bc0',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px', color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      color: 'white',
                      fontWeight: location.pathname === item.path ? 700 : 400,
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <List>
            {/* For non-admin/finance users */}
            {navigationItems.map((item, index) => (
              <ListItem
                key={`nav-item-${item.path}`}
                button
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                className="slide-in-left"
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  backgroundColor: '#283593',
                  '&:hover': {
                    transform: 'translateX(5px)',
                    backgroundColor: '#3949ab',
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#3f51b5',
                    borderLeft: '4px solid',
                    borderColor: 'secondary.main',
                    '&:hover': {
                      backgroundColor: '#5c6bc0',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px', color: 'white' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    sx: {
                      color: 'white',
                      fontWeight: location.pathname === item.path ? 700 : 400,
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', my: 2 }} />
        <List>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: '10px',
              mx: 1,
              mb: 1,
              backgroundColor: '#c62828', // Red background for logout button
              '&:hover': {
                backgroundColor: '#e53935', // Lighter red on hover
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px', color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                color: '#ffffff'
              }}
            />
          </ListItem>
        </List>

        {/* Add RoleFixButton for admin users */}
        {user?.role?.toLowerCase() === 'admin' && (
          <Box sx={{ p: 2 }}>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />
            <Typography variant="subtitle2" sx={{ color: '#ff9800', fontWeight: 'bold' }} gutterBottom>
              Having permission issues?
            </Typography>
            <RoleFixButton />
          </Box>
        )}
      </Box>
    </Box>
  );

  // Don't return null if user is not available, as this causes the navigation to disappear
  // Instead, we'll handle this case in the render method
  // if (!user) {
  //   return null;
  // }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'linear-gradient(90deg, #3f51b5 0%, #002984 100%)',
          transition: 'all 0.3s ease',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: 'none' },
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'rotate(90deg)' }
              }}
              className="pulse"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
              className="fade-in"
            >
              {user?.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel` : 'Dashboard'}
            </Typography>
          </Box>

          {/* Right side of AppBar - can add notifications, profile menu, etc. */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Quick logout">
              <IconButton
                color="inherit"
                size="small"
                onClick={handleLogout}
                sx={{
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  '&:hover': { opacity: 1, transform: 'scale(1.1)' }
                }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              overflowY: 'auto',
              height: '100%',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              background: '#1a237e',
              overflowY: 'auto',
              height: '100%',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navigation;








