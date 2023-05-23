// Import necessary packages and modules
import './App.css';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
// Create a Supabase client object using the Supabase URL and API key
const supabase = createClient(
	'https://xspqvvczdswhmunxfrpg.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcHF2dmN6ZHN3aG11bnhmcnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3NjgwNTUsImV4cCI6MjAwMDM0NDA1NX0.9wDTrAdm7thoXTwrAe-whdP9yohzhQtVwFSMUpCEg10'
);
// Define the main App component
export default function App() {
	// Define a state for the leaderboard, which will be updated later
	const [leaderboard, setLeaderboard] = useState([]);
	// Define a state variable to represent the user's session
	const [session, setSession] = useState(null);
	// Use the useEffect hook to fetch the user's session and set it to the state variable
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		// async function handleClick() {
		//  // Writing
		//  let { data, error } = await supabase
		//    .from('leaderboard')
		//    .insert({ name: 'Bob', score: 99999 });
		// }

		// Create a subscription to the user's authentication state changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
		// Clean up the subscription when the component unmounts
		return () => subscription.unsubscribe();
	}, []);
	// If there is no session, render the authentication UI component
	if (!session) {
		return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
	}
	// If there is a session, render the "Logged in!" message
	else {
		// Reading

		const readLeaderboard = async () => {
			// Read the data
			let { data, error } = await supabase
				.from('leaderboard')
				.select('user_id, score')
				.order('score', { ascending: false });

			if (error) {
				console.error(error);
				return;
			}

			console.log(data);
			// update leaderboard based on data
			setLeaderboard([...data]);
			console.log({ leaderboard });
		};

		return (
			<div>
				Logged in!
				<input type='text' />
				<button onClick={readLeaderboard}>View leaderboard</button>
				<button onClick={() => setLeaderboard([])}>Hide leaderboard</button>
				<button onClick={() => setSession(null)}>Log out</button>
				<h1>Leaderboard</h1>
				{/* return list item for each user id and score in leaderboard */}
				<ul>
					{leaderboard.map((item, index) => (
						<li key={index}>
							User ID: {item.user_id.slice(0, 3) + '...'} Score: {item.score}
						</li>
					))}
				</ul>
			</div>
		);
	}
}
