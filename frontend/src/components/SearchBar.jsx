import React from 'react'
import { Input } from './Input'
import { Search } from 'lucide-react'

const SearchBar = ({ search, setSearch }) => {
    return (
        <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
                placeholder="Search leads..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    )
}

export default SearchBar