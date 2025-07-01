import pytest
from app import create_app



@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_upload_pdf(client):
    data = {
        'file': (open('test.pdf', 'rb'), 'test.pdf')
    }
    response = client.post('/api/upload', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    assert 'summary' in response.get_json()


def test_upload_no_file(client):
    response = client.post('/api/upload', data={}, content_type='multipart/form-data')
    assert response.status_code == 400
    assert response.get_json() == {'error': 'No file part'}


def test_upload_invalid_file(client):
    data = {
        'file': (open('test.txt', 'rb'), 'test.txt')
    }
    response = client.post('/api/upload', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    assert response.get_json() == {'error': 'File is not a PDF'}
