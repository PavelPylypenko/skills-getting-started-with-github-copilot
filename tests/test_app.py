import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_root_redirect():
    response = client.get("/")
    assert response.status_code == 200
    assert "<!DOCTYPE html>" in response.text  # Check if HTML content is returned

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    assert isinstance(response.json(), dict)

def test_signup_for_activity():
    response = client.post("/activities/Chess Club/signup", json={"email": "newstudent@mergington.edu"})
    assert response.status_code == 200
    assert response.json() == {"message": "Signed up newstudent@mergington.edu for Chess Club"}

def test_signup_for_nonexistent_activity():
    response = client.post("/activities/Nonexistent/signup", json={"email": "student@mergington.edu"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Activity not found"}

def test_unregister_participant():
    response = client.post("/unregister", json={"email": "michael@mergington.edu", "activity": "Chess Club"})
    assert response.status_code == 200
    assert response.json() == {"message": "Participant unregistered successfully"}

def test_unregister_nonexistent_participant():
    response = client.post("/unregister", json={"email": "nonexistent@mergington.edu", "activity": "Chess Club"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Participant not registered"}