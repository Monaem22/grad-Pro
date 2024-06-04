import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Transcript() {
  const [transcriptData, setTranscriptData] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to fetch data only once when component mounts

  const fetchData = async () => {
    try {
      const response = await axios.get('https://grad-project-3zvo.onrender.com/app/user/showMyProfile', {
        withCredentials: true
      });
      // Assuming the transcript data is under the key 'transcript' in the response
      setTranscriptData(response.data.my_Profile.transcript);
    } catch (error) {
      console.error('Error fetching transcript data:', error);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('application', file);

    try {
      setUploading(true);
      await axios.post('https://grad-project-3zvo.onrender.com/app/user/uploadTranscript', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Refresh transcript data after successful upload
      await fetchData();
    } catch (error) {
      console.error('Error uploading transcript:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('https://grad-project-3zvo.onrender.com/app/user/deleteTranscript', {
        withCredentials: true,
      });
      // Clear transcript data after successful deletion
      setTranscriptData(null);
    } catch (error) {
      console.error('Error deleting transcript:', error);
    }
  };

  return (
    <div>
      <h2>Transcript</h2>
      <div style={styles.transcriptContainer}>
        {transcriptData ? (
          <>
            <iframe
              src={`https://grad-project-3zvo.onrender.com${transcriptData}`}
              style={styles.iframe}
              title="Transcript"
            />
            <button onClick={handleDelete} style={styles.deleteButton}>
              Delete Transcript
            </button>
          </>
        ) : (
          <>
            <p>No transcript uploaded.</p>
            <input type="file" onChange={handleUpload} disabled={uploading} />
            {uploading ? <p>Uploading...</p> : null}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  transcriptContainer: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px', // Adjusted maximum width
    margin: '0 auto', // Centering the container horizontally
    padding: '20px',
  },
  iframe: {
    width: '100%',
    height: '500px', // Adjusted height
    border: 'none',
    marginBottom: '20px',
  },
  deleteButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
  },
};

