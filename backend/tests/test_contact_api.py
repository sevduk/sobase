"""Regression tests for contact form validation and persistence response."""
import os

import pytest
import requests


BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")


@pytest.fixture
def client():
    with requests.Session() as session:
        session.headers.update({"Content-Type": "application/json"})
        yield session


def test_contact_submission_returns_success(client):
    response = client.post(
        f"{BASE_URL}/api/contact",
        json={
            "name": "TEST_Atelier Reviewer",
            "email": "test-reviewer@example.com",
            "project_type": "Logo Tasarımı",
            "message": "TEST_Contact API verification",
        },
        timeout=15,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["message"]


@pytest.mark.parametrize("payload", [
    {"name": "", "email": "bad", "project_type": "", "message": ""},
    {"name": "Only Name"},
])
def test_contact_submission_rejects_invalid_payload(client, payload):
    response = client.post(f"{BASE_URL}/api/contact", json=payload, timeout=15)
    assert response.status_code == 422