import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ClearIcon from '@mui/icons-material/Clear';
import { NewsFilters } from '../types/news';

const AVAILABLE_CATEGORIES = [
  { id: '', name: 'All' },
  { id: 'business', name: 'Business' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'general', name: 'General' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' },
];

const AVAILABLE_SOURCES = [
  { id: 'newsapi', name: 'News API' },
  { id: 'guardian', name: 'The Guardian' },
  { id: 'nyt', name: 'The New York Times' },
];

interface SearchFiltersProps {
  filters: NewsFilters;
  onFiltersChange: (filters: NewsFilters) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchQuery: event.target.value,
    });
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      categories: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSourceChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onFiltersChange({
      ...filters,
      sources: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleDateChange = (date: Date | null, field: 'from' | 'to') => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      dateRange: {
        from: null,
        to: null,
      },
      categories: [],
      sources: [],
    });
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Search articles"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          size="small"
        />
        <IconButton
          onClick={clearFilters}
          disabled={!filters.searchQuery && !filters.categories.length && !filters.sources.length}
        >
          <ClearIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Categories</InputLabel>
          <Select
            value={filters.categories}
            onChange={handleCategoryChange}
            label="Categories"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip key={value} label={AVAILABLE_CATEGORIES.find((c) => c.id === value)?.name} size="small" />
                ))}
              </Box>
            )}
          >
            {AVAILABLE_CATEGORIES.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sources</InputLabel>
          <Select
            multiple
            value={filters.sources}
            onChange={handleSourceChange}
            label="Sources"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => (
                  <Chip
                    key={value}
                    label={AVAILABLE_SOURCES.find((s) => s.id === value)?.name}
                    size="small"
                  />
                ))}
              </Box>
            )}
          >
            {AVAILABLE_SOURCES.map((source) => (
              <MenuItem key={source.id} value={source.id}>
                {source.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="From Date"
            value={filters.dateRange.from}
            onChange={(date: Date | null) => handleDateChange(date, 'from')}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="To Date"
            value={filters.dateRange.to}
            onChange={(date: Date | null) => handleDateChange(date, 'to')}
            slotProps={{ textField: { size: 'small' } }}
          />
        </LocalizationProvider>
      </Box>
    </Paper>
  );
}; 