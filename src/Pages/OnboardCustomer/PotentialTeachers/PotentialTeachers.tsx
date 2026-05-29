import { Effect } from 'effect';
import { useEffect, useState } from 'react';
import { DanceType, Teacher } from '../../../dtoModels';
import { getParsedResponse } from '../../../Forms/Submission/formikSubmission';
import './PotentialTeachers.css';

interface Props {
  onCheckedTeachersChange: (checkedIds: Set<number>) => void;
}

export default function PotentialTeachers({ onCheckedTeachersChange }: Props) {
  const [danceTypes, setDanceTypes] = useState([] as DanceType[]);
  const [selectedDanceTypeId, setSelectedDanceTypeId] = useState('');
  const [teachers, setTeachers] = useState([] as Teacher[]);
  const [checkedTeacherIds, setCheckedTeacherIds] = useState(new Set<number>());

  useEffect(() => {
    getParsedResponse('danceType', Array<DanceType>)
      .then(result =>
        Effect.runPromise(Effect.match(result, {
          onSuccess: parsed => setDanceTypes(parsed as DanceType[]),
          onFailure: err => console.error(err)
        }))
      );
  }, []);

  useEffect(() => {
    if (!selectedDanceTypeId) {
      setTeachers([]);
      return;
    }
    getParsedResponse(`danceType/${selectedDanceTypeId}/teacher`, Array<Teacher>)
      .then(result =>
        Effect.runPromise(Effect.match(result, {
          onSuccess: parsed => {
            setTeachers(parsed as Teacher[]);
            setCheckedTeacherIds(new Set());
          },
          onFailure: err => console.error(err)
        }))
      );
  }, [selectedDanceTypeId]);

  const toggleTeacher = (teacherId: number, checked: boolean) => {
    const next = new Set(checkedTeacherIds);
    if (checked) next.add(teacherId);
    else next.delete(teacherId);
    setCheckedTeacherIds(next);
    onCheckedTeachersChange(next);
  };

  return (
    <>
      <select value={selectedDanceTypeId} onChange={e => setSelectedDanceTypeId(e.target.value)}>
        <option value="">-- Select a dance type --</option>
        {danceTypes.map(dt => (
          <option key={dt.danceTypeId} value={dt.danceTypeId}>
            {dt.name}
          </option>
        ))}
      </select>
      <ul>
        {teachers.map(t => (
          <li key={t.teacherId}>
            <input
              type="checkbox"
              id={`teacher-${t.teacherId}`}
              checked={checkedTeacherIds.has(t.teacherId)}
              onChange={e => toggleTeacher(t.teacherId, e.target.checked)}
            />
            <label htmlFor={`teacher-${t.teacherId}`}>{t.firstName} {t.lastName}</label>
          </li>
        ))}
      </ul>
    </>
  );
}
