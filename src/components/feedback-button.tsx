/**
 * @copyright Copyright (C) 2025 Dennis Greguhn <dev@greguhn.de>
 * 
 * @author Dennis Greguhn <dev@greguhn.de>
 * 
 * @license AGPL-3.0-or-later
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// MUI
import { Button } from "@mui/material";
import ForumIcon from '@mui/icons-material/Forum';

function FeedbackButton() {

	return (
		import.meta.env.VITE_FEEDBACK_URL ? 
			<Button
				variant="outlined"
				startIcon={<ForumIcon />}
				color="primary"
				aria-label="give feedback"
				onClick={()=> window.open(import.meta.env.VITE_FEEDBACK_URL, "_blank")}>Feedback
			</Button> : <></>
	)
}

export default FeedbackButton