const BASE_URL = "http://localhost:8080/api/users";

export async function getUserByEmail(email) {
	const response = await fetch(`${BASE_URL}/by-email?email=${encodeURIComponent(email)}`);
	if (!response.ok) {
		throw new Error("User not found");
	}
	return response.json();
}
